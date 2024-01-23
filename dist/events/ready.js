Object.defineProperty(exports, '__esModule', { value: true, });
const event = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`봇 [ ${client.user.tag} ] 가 성공적으로 로그인 되었습니다.`);
  },
};
exports.default = event;
//# sourceMappingURL=ready.js.map
