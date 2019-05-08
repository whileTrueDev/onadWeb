exports.Box = function(){
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var socket = io();
console.log('일단 옴')
// function Broadcast(){
//     this.streamList = [];
//     // this.dict = {url : undefined, streamerId :undefined, websocketID : undefined };
    
//     this.getKeyList = function(){
//         var urlKeys = this.streamList.map((v) => {          //tmpList 안 딕셔너리들의 키값 뽑아줌
//             var dictKeys = Object.keys(v)[0];
//             console.log(dictKeys)
//             return dictKeys;
//             });
//         return urlKeys;
//     };
// };
exports.write = function (){
    console.log('아된다된다')
    return '제발'
} 
// socket.on('user joined', function(numOfUsers){
//     console.log(numOfUsers);
//     console.log('된다')
// });
};