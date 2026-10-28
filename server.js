import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { randomBytes } from 'node:crypto';
const app=express(),server=createServer(app),io=new Server(server);app.use(express.static('public'));const rooms=new Map();
const code=()=>randomBytes(3).toString('hex').toUpperCase();
function outcome(b){for(const [a,c,d] of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]])if(b[a]&&b[a]===b[c]&&b[a]===b[d])return b[a];return b.every(Boolean)?'draw':null}
function state(r){return {board:r.board,turn:r.turn,winner:r.winner,scores:r.scores,players:{X:!!r.players.X,O:!!r.players.O},round:r.round}}
function emit(r){io.to(r.id).emit('state',state(r))}
io.on('connection',s=>{let roomId=null,role=null;function leave(){if(!roomId)return;const r=rooms.get(roomId);if(r&&role&&r.players[role]===s.id){r.players[role]=null;emit(r);if(!r.players.X&&!r.players.O)rooms.delete(roomId)}s.leave(roomId);roomId=null;role=null}
s.on('create',(_,cb)=>{leave();let id;do{id=code()}while(rooms.has(id));const r={id,players:{X:s.id,O:null},board:Array(9).fill(null),turn:'X',winner:null,scores:{X:0,O:0,draw:0},round:1};rooms.set(id,r);roomId=id;role='X';s.join(id);cb({ok:true,id,role});emit(r)});
s.on('join',(raw,cb)=>{const id=String(raw||'').trim().toUpperCase(),r=rooms.get(id);if(!r)return cb({ok:false,error:'Room not found. Ask your friend for a new code.'});if(r.players.X&&r.players.O)return cb({ok:false,error:'This room already has two players.'});leave();role=r.players.X?'O':'X';r.players[role]=s.id;roomId=id;s.join(id);cb({ok:true,id,role});emit(r)});
s.on('move',(i)=>{const r=rooms.get(roomId);if(!r||!role||r.players[role]!==s.id||!r.players.X||!r.players.O||r.winner||r.turn!==role||!Number.isInteger(i)||i<0||i>8||r.board[i])return;r.board[i]=role;r.winner=outcome(r.board);if(r.winner)r.scores[r.winner]++;else r.turn=role==='X'?'O':'X';emit(r)});
s.on('again',()=>{const r=rooms.get(roomId);if(!r||!role||r.players[role]!==s.id||!r.players.X||!r.players.O||!r.winner)return;r.board=Array(9).fill(null);r.winner=null;r.round++;r.turn=r.round%2?'X':'O';emit(r)});
s.on('disconnect',leave);s.on('leave',leave)});
app.get('/health',(_,res)=>res.json({ok:true}));server.listen(process.env.PORT||3000,'0.0.0.0');
