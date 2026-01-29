// ====================
// GOOGLE APPS SCRIPT - Behavior Tracker API
// ====================
// 
// SETUP INSTRUCTIONS:
// 1. Go to Google Sheets → Create new spreadsheet
// 2. Name it "Behavior Tracker Data"
// 3. Go to Extensions → Apps Script
// 4. Delete any code there and paste this entire file
// 5. Click "Deploy" → "New deployment"
// 6. Select type: "Web app"
// 7. Execute as: "Me"
// 8. Who has access: "Anyone"
// 9. Click "Deploy" and copy the URL
// 10. Paste that URL in the app's config
//
// The script will auto-create these sheets:
// - "Config" - stores behaviors and rewards config
// - "Artin" - Artin's history
// - "Aiden" - Aiden's history
// - "Scores" - current scores

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Initialize sheets if they don't exist
  initializeSheets(ss);
  
  const action = e.parameter.action;
  let result = {};
  
  try {
    switch(action) {
      case 'getData':
        result = getAllData(ss);
        break;
      case 'recordBehavior':
        const data = JSON.parse(e.postData.contents);
        result = recordBehavior(ss, data);
        break;
      case 'undoLast':
        const undoData = JSON.parse(e.postData.contents);
        result = undoLast(ss, undoData.child);
        break;
      case 'claimReward':
        const claimData = JSON.parse(e.postData.contents);
        result = claimReward(ss, claimData);
        break;
      case 'updateConfig':
        const configData = JSON.parse(e.postData.contents);
        result = updateConfig(ss, configData);
        break;
      case 'resetAll':
        result = resetAll(ss);
        break;
      default:
        result = { error: 'Unknown action' };
    }
  } catch (error) {
    result = { error: error.toString() };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function initializeSheets(ss) {
  const requiredSheets = ['Scores', 'Artin', 'Aiden', 'Config', 'ClaimedRewards'];
  
  requiredSheets.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      
      if (name === 'Scores') {
        sheet.getRange('A1:D1').setValues([['Child', 'Score', 'WeeklyScore', 'WeekStart']]);
        sheet.getRange('A2:D3').setValues([
          ['Artin', 0, 0, getWeekStart()],
          ['Aiden', 0, 0, getWeekStart()]
        ]);
      } else if (name === 'Artin' || name === 'Aiden') {
        sheet.getRange('A1:F1').setValues([['Timestamp', 'Date', 'BehaviorId', 'Label', 'Points', 'Type']]);
      } else if (name === 'ClaimedRewards') {
        sheet.getRange('A1:D1').setValues([['Child', 'RewardId', 'Label', 'ClaimedAt']]);
      }
    }
  });
  
  // Check for weekly reset
  const scoresSheet = ss.getSheetByName('Scores');
  const weekStart = scoresSheet.getRange('D2').getValue();
  const currentWeekStart = getWeekStart();
  
  if (weekStart !== currentWeekStart) {
    // Reset weekly scores
    scoresSheet.getRange('C2:C3').setValues([[0], [0]]);
    scoresSheet.getRange('D2:D3').setValues([[currentWeekStart], [currentWeekStart]]);
    
    // Clear claimed rewards for new week
    const claimedSheet = ss.getSheetByName('ClaimedRewards');
    const lastRow = claimedSheet.getLastRow();
    if (lastRow > 1) {
      claimedSheet.getRange(2, 1, lastRow - 1, 4).clear();
    }
  }
}

function getWeekStart() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function getAllData(ss) {
  const scoresSheet = ss.getSheetByName('Scores');
  const artinSheet = ss.getSheetByName('Artin');
  const aidenSheet = ss.getSheetByName('Aiden');
  const claimedSheet = ss.getSheetByName('ClaimedRewards');
  
  // Get scores
  const scoresData = scoresSheet.getRange('A2:D3').getValues();
  const scores = {};
  const weeklyScores = {};
  scoresData.forEach(row => {
    scores[row[0]] = row[1];
    weeklyScores[row[0]] = row[2];
  });
  
  // Get history
  const history = {
    Artin: getSheetHistory(artinSheet),
    Aiden: getSheetHistory(aidenSheet)
  };
  
  // Get claimed rewards
  const claimedData = claimedSheet.getLastRow() > 1 
    ? claimedSheet.getRange(2, 1, claimedSheet.getLastRow() - 1, 4).getValues()
    : [];
  
  const claimed = { Artin: [], Aiden: [] };
  claimedData.forEach(row => {
    if (row[0] && claimed[row[0]]) {
      claimed[row[0]].push(row[1]);
    }
  });
  
  return {
    success: true,
    scores,
    weeklyScores,
    history,
    claimed
  };
}

function getSheetHistory(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  return data.map(row => ({
    timestamp: row[0],
    date: row[1],
    id: row[2],
    label: row[3],
    points: row[4],
    type: row[5]
  })).reverse(); // Most recent first
}

function recordBehavior(ss, data) {
  const { child, behavior } = data;
  const sheet = ss.getSheetByName(child);
  const scoresSheet = ss.getSheetByName('Scores');
  
  const now = new Date();
  const timestamp = now.toISOString();
  const date = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  
  // Add to history
  sheet.appendRow([timestamp, date, behavior.id, behavior.label, behavior.points, behavior.type]);
  
  // Update scores
  const row = child === 'Artin' ? 2 : 3;
  const currentScore = scoresSheet.getRange(row, 2).getValue();
  const currentWeekly = scoresSheet.getRange(row, 3).getValue();
  
  scoresSheet.getRange(row, 2).setValue(currentScore + behavior.points);
  scoresSheet.getRange(row, 3).setValue(currentWeekly + behavior.points);
  
  return { 
    success: true,
    newScore: currentScore + behavior.points,
    newWeeklyScore: currentWeekly + behavior.points
  };
}

function undoLast(ss, child) {
  const sheet = ss.getSheetByName(child);
  const scoresSheet = ss.getSheetByName('Scores');
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return { success: false, error: 'No history to undo' };
  }
  
  // Get last entry
  const lastEntry = sheet.getRange(lastRow, 1, 1, 6).getValues()[0];
  const points = lastEntry[4];
  
  // Delete last row
  sheet.deleteRow(lastRow);
  
  // Update scores
  const row = child === 'Artin' ? 2 : 3;
  const currentScore = scoresSheet.getRange(row, 2).getValue();
  const currentWeekly = scoresSheet.getRange(row, 3).getValue();
  
  scoresSheet.getRange(row, 2).setValue(currentScore - points);
  scoresSheet.getRange(row, 3).setValue(currentWeekly - points);
  
  return { 
    success: true,
    newScore: currentScore - points,
    newWeeklyScore: currentWeekly - points
  };
}

function claimReward(ss, data) {
  const { child, reward } = data;
  const claimedSheet = ss.getSheetByName('ClaimedRewards');
  
  claimedSheet.appendRow([child, reward.id, reward.label, new Date().toISOString()]);
  
  return { success: true };
}

function resetAll(ss) {
  const scoresSheet = ss.getSheetByName('Scores');
  const artinSheet = ss.getSheetByName('Artin');
  const aidenSheet = ss.getSheetByName('Aiden');
  const claimedSheet = ss.getSheetByName('ClaimedRewards');
  
  // Reset scores
  scoresSheet.getRange('B2:C3').setValues([[0, 0], [0, 0]]);
  
  // Clear history
  [artinSheet, aidenSheet].forEach(sheet => {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 6).clear();
    }
  });
  
  // Clear claimed rewards
  const claimedLastRow = claimedSheet.getLastRow();
  if (claimedLastRow > 1) {
    claimedSheet.getRange(2, 1, claimedLastRow - 1, 4).clear();
  }
  
  return { success: true };
}
