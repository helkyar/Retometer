const date = document.querySelector(".date");
const challenges = document.querySelector(".challenges");
const dyn = document.querySelector(".dynamic");

const finaldate = localStorage.getItem("end");

/**
 * Get date from input and set it to local storage
 */
if (!finaldate) {
  const dateform = document.querySelector(".date-form");
  dateform.addEventListener("submit", setDate);

  function setDate(e) {
    e.preventDefault();
    const dateinput = document.querySelector(".date-form input");
    const end = new Date(`${dateinput.value.split(" ").join("T")}:00`);

    if (end == "Invalid Date") dateinput.value = "";
    else localStorage.setItem("end", end.getTime());

    location.reload();
  }

  /**
   * Get challenges from input and set it to local storage
   */
} else {
  date.classList.add("hidden");
  challenges.classList.remove("hidden");

  if (localStorage.getItem("chg")) dyn.innerHTML += localStorage.getItem("chg");

  const countdown = document.querySelector(".countdown");

  const setCountDown = () => {
    let timeleft = finaldate - Date.now();
    let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));

    countdown.innerText = `${days}d ${hours}:${minutes}h`;
  };
  setCountDown();
  setInterval(setCountDown(), 60000);

  const challengesform = document.querySelector(".challenges-form");
  challengesform.addEventListener("submit", setChallenge);

  function setChallenge(e) {
    e.preventDefault();
    const c = document.querySelectorAll(".challenges-form input");

    const newChallenge = `  
        <article class="chg">            
            <button class="minus">-</button> 
            <span class="daily">${c[3].value}</span>
            <button class="plus">+</button>
            <strong>${c[0].value}:</strong> 
            <span class="amount">${c[1].value}</span>
            <span>${c[2].value}</span>
            [<span class="days-left">
                ${(c[1].value / c[3].value).toFixed(2)}
            </span>(d)]       
            <button class="del">x</button>     
        </article>
    `;
    const localChallenge = localStorage.getItem("chg");
    localStorage.setItem("chg", localChallenge + newChallenge);
    dyn.innerHTML += newChallenge;
  }
}

/**
 * Update challenges
 */
challenges.addEventListener("click", updateChallenge);

function updateChallenge(e) {
  if (e.target.tagName != "BUTTON") return;

  [...challenges.querySelectorAll(".chg")].map((art) => {
    const minus = art.querySelector(".minus");
    const plus = art.querySelector(".plus");
    const del = art.querySelector(".del");

    if (e.target == minus) {
      const daily = art.querySelector(".daily");
      const amount = art.querySelector(".amount");
      const daysleft = art.querySelector(".days-left");
      amount.innerText = amount.innerText - daily.innerText;
      daysleft.innerText = (amount.innerText / daily.innerText).toFixed(2);
      // if (!art.getAttribute("style")) {
      art.setAttribute("style", "background-color:rgb(0,250,0)");
      // } else {
      //   let s = art.getAttribute("style").split(":")[1].split(",")[0];
      //   let n = art.getAttribute("style").split(":")[1].split(",")[1];
      //   n = n.substring(0, n.length - 1) - 50;
      //   s = n.substring(0, s.length - 1) * 1;
      //   s > 100
      //     ? art.setAttribute("style", "background-color:rgb(0,250,0)")
      //     : art.setAttribute("style", `background-color:rgb(0,${n},0)`);
      // }
    } else if (e.target == plus) {
      const daily = art.querySelector(".daily");
      const amount = art.querySelector(".amount");
      const daysleft = art.querySelector(".days-left");
      amount.innerText = amount.innerText * 1 + daily.innerText * 1;
      daysleft.innerText = (amount.innerText / daily.innerText).toFixed(2);
      // if (!art.getAttribute("style")) {
      art.setAttribute("style", "background-color:rgb(250,250,250)");
      // } else {
      //   let n = art.getAttribute("style").split(":")[1].split(",")[1];
      //   n = n.substring(0, n.length - 1) * 1 + 50;
      //   n > 250
      //     ? art.setAttribute("style", `background-color:rgb(255,255,255)`)
      //     : art.setAttribute("style", `background-color:rgb(0,${n},0)`);
      // }
    } else if (e.target == del) {
      art.parentNode.removeChild(art);
    }
  });
  localStorage.setItem("chg", dyn.innerHTML);
}
