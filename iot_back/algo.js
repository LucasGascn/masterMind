exports.MastermindSolver = (code, solution) => {
  const S = solution.map((el) => el); // solution of the mastermind
  const R = code; // user answer
  // code is null x 5 upon sending the info twice
  //Final array
  const F = [
    { value: null, status: "incorrect" },
    { value: null, status: "incorrect" },
    { value: null, status: "incorrect" },
    { value: null, status: "incorrect" },
    { value: null, status: "incorrect" },
  ];

  for (let i = 0; i < S.length; i++) {
    if (R[i] === S[i]) {
      F[i].value = R[i];
      F[i].status = "correct";
      R[i] = null;
      S[i] = null;
      continue;
    } else if (S.includes(R[i])) {
      F[i].value = R[i];
      F[i].status = "misplaced";
      const index = S.indexOf(R[i]);
      R[i] = null;
      S[index] = null;
      continue;
    } else {
      F[i].value = R[i];
      continue;
    }
  }
  // F is the final tab if all status from F are « correct » then open the magnet
  return F;
};
