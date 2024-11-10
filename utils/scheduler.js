const cron = require('node-cron');
const Board = require('../models/Board');
const GameBoard = require('../models/GameBoard');
const moment = require('moment-timezone');

// 매일 UTC 기준 오전 2시 30분에 실행하여 서울 시간 오전 11시 30분에 작업하도록 설정
cron.schedule('30 2 * * *', async () => {
// cron.schedule('* * * * *', async () => {  
  const currentSeoulTime = moment().tz('Asia/Seoul').format('HH:mm');
  const seoulDate = moment().tz('Asia/Seoul').format('YYYY.MM.DD');

  // isAnonymous 필드를 false로 변경하는 작업
  if (currentSeoulTime === '11:30') {
    try {
      const result = await Board.updateMany(
        { isAnonymous: true },
        { $set: { isAnonymous: false } }
      );
      console.log(`${result.modifiedCount}개의 게시글의 isAnonymous 필드가 false로 변경되었습니다.`);
    } catch (error) {
      console.error('게시글 업데이트 중 오류 발생:', error);
    }
  }

  // createdAt 날짜가 하루 지난 게시글의 isEnd 상태를 true로 변경하는 작업
  try {
    const boardResult = await Board.updateMany(
      { createdAt: { $lt: seoulDate }, isEnd: false }, // 하루 지난 게시글 중 isEnd가 false인 것만
      { $set: { isEnd: true } }
    );
    console.log(`${boardResult.modifiedCount}개의 boards 컬렉션 게시글의 isEnd 필드가 true로 변경되었습니다.`);

    const gameBoardResult = await GameBoard.updateMany(
      { createdAt: { $lt: seoulDate }, isEnd: false },
      { $set: { isEnd: true } }
    );
    console.log(`${gameBoardResult.modifiedCount}개의 gameboards 컬렉션 게시글의 isEnd 필드가 true로 변경되었습니다.`);
  } catch (error) {
    console.error('게시글 업데이트 중 오류 발생:', error);
  }
});

console.log('스케줄러가 설정되었습니다.');
