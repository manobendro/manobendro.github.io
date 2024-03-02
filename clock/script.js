(() => {
  const words = [
    "pone",
    "soya",
    "1.5",
    "2.5",
    "ta",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "005",
    "010",
    "020",
    "025",
    "030",
    "035",
    "040",
    "050",
    "055",
  ];

  function closestMinimumDividedBy5(minutes) {
    if (minutes < 0 || minutes > 59) {
      throw new Error("Input must be between 0 and 59.");
    }
    return Math.floor(minutes / 5) * 5;
  }

  function getNextHour(currentHour) {
    if (currentHour < 1 || currentHour > 12) {
      throw new Error("Input must be between 1 and 12.");
    }
    return (currentHour % 12) + 1;
  }

  function clearDisplay() {
    for (const word of words) {
      const element = document.getElementById(word);
      if (element) {
        element.setAttribute("fill", "#182D3A");
      }
    }
  }

  function showWord(id) {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute("fill", "#E94F37");
    }
  }

  function showTime(hours, minutes) {
    clearDisplay();

    if (hours === 1 && minutes >= 30 && minutes <= 34) {
      showWord("1.5");
      showWord("ta");
      return;
    }

    if (hours === 2 && minutes >= 30 && minutes <= 34) {
      showWord("2.5");
      showWord("ta");
      return;
    }

    if (minutes >= 15 && minutes <= 19) {
      showWord("soya");
      showWord(hours.toString().padStart(2, "0"));
      showWord("ta");
      return;
    }

    if (minutes >= 45 && minutes <= 49) {
      showWord("pone");
      showWord(getNextHour(hours).toString().padStart(2, "0"));
      showWord("ta");
      return;
    }

    showWord(hours.toString().padStart(2, "0"));
    showWord("ta");

    const roundedMinutes = closestMinimumDividedBy5(minutes);
    if (roundedMinutes > 4) {
      showWord(roundedMinutes.toString().padStart(3, "0"));
    }
  }

  function printTime() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes();

    showTime(hours, minutes);
    console.log(`Current time: ${hours}:${minutes}`);
  }

  setInterval(printTime, 1000);
})();

// __debug__
//   let h = 1;
//   let m = 1;
//function debugPrintTime() {
// showTime(h, m);
// console.log(`Current time: ${h}:${m}`);
// m += 1;
// if (m == 60) {
//   m = 1;
//   h += 1;
// }
// if (h == 13) {
//   h = 1;
//  }
//}
