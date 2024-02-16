exports.MastermindSolver = (code, solution) => {
  const solutionArray = solution.map((el) => el); // solution of the mastermind
  const response = code; // user answer
  // code is null x 5 upon sending the info twice
  //Final array
  const finalArray = [
    { value: null, status: "incorrect" },
    { value: null, status: "incorrect" },
    { value: null, status: "incorrect" },
    { value: null, status: "incorrect" },
    { value: null, status: "incorrect" },
  ];

  for (let i = 0; i < solutionArray.length; i++) {
    if (response[i] === solutionArray[i]) {
      finalArray[i].value = response[i];
      finalArray[i].status = "correct";
      response[i] = null;
      solutionArray[i] = null;
      continue;
    } else if (S.includes(response[i])) {
      finalArray[i].value = response[i];
      finalArray[i].status = "misplaced";
      const index = S.indexOf(response[i]);
      response[i] = null;
      solutionArray[index] = null;
      continue;
    } else {
      finalArray[i].value = response[i];
      continue;
    }
  }
  // F is the finalArray tab if all status from F are « correct » then open the magnet
  return finalArray;
};
