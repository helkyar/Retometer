hello();

const date = document.querySelector(".date");
const challenges = document.querySelector(".challenges");

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
} else {
  /**
   * Get challenges from input and create new challenge
   */
  date.classList.add("hidden");
  challenges.classList.remove("hidden");
  const dyn = document.querySelector(".dynamic");
  const countdown = document.querySelector(".countdown");

  if (localStorage.getItem("chg")) dyn.innerHTML += localStorage.getItem("chg");

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
            <span><strong class="score">0</strong>/${c[1].value}</span>
            <span>${c[2].value}</span>
            <span class="amount">${c[1].value}</span>
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

  /**
   * Update challenges
   */
  challenges.addEventListener("click", updateChallenge);

  function updateChallenge(e) {
    if (e.target.tagName != "BUTTON") return;
    const reset = challenges.querySelector(".reset");
    let art = [...challenges.querySelectorAll(".chg")];

    for (let i = 0; i < art.length; i++) {
      //
      if (e.target == art[i].querySelector(".minus")) {
        const daily = art[i].querySelector(".daily");
        const score = art[i].querySelector(".score");
        const amount = art[i].querySelector(".amount");
        const daysleft = art[i].querySelector(".days-left");
        score.innerText = score.innerText * 1 + daily.innerText * 1;
        amount.innerText = amount.innerText - daily.innerText;
        daysleft.innerText = (amount.innerText / daily.innerText).toFixed(2);

        art[i].setAttribute("style", "background-color:rgb(0,250,0)");
        break;
        //
      } else if (e.target == art[i].querySelector(".plus")) {
        const daily = art[i].querySelector(".daily");
        const score = art[i].querySelector(".score");
        const amount = art[i].querySelector(".amount");
        const daysleft = art[i].querySelector(".days-left");
        score.innerText = score.innerText - daily.innerText;
        amount.innerText = amount.innerText * 1 + daily.innerText * 1;
        daysleft.innerText = (amount.innerText / daily.innerText).toFixed(2);

        art[i].setAttribute("style", "background-color:rgb(250,250,250)");
        break;
        //
      } else if (e.target == art[i].querySelector(".del")) {
        art[i].parentNode.removeChild(art[i]);
        break;
        //
      } else if (e.target == reset) {
        art[i].setAttribute("style", "background-color:rgb(250,250,250)");
      }
    }
    localStorage.setItem("chg", dyn.innerHTML);
  }
}
