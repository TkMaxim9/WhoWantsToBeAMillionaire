let question_block = document.getElementById('question_text');
let first_answer_button = document.getElementById('1');
let second_answer_button = document.getElementById('2');
let third_answer_button = document.getElementById('3');
let fourth_answer_button = document.getElementById('4');
let prizes = Array.from(document.getElementsByClassName('prize'));
prizes = prizes.reverse()
let user_name = document.getElementById('user_name');
let safe_amount = document.getElementById('safe_amount_select');
let start_block = document.getElementById('start_block');
let main_block = document.getElementById('main_block');
let start_button = document.getElementById('start_block_OK');
let end_block = document.getElementById('game_end_block');
let right_answer = document.getElementById('right_answer');
let won = document.getElementById('won');
let end_button = document.getElementById('end_button');
let warning = document.getElementById('warning');
let question_num = document.getElementById('question_num');
let assist_50 = document.getElementById('50/50');
let assist_change = document.getElementById('change_question');
let assist_mistake = document.getElementById('mistake_chance');
let assist_hall = document.getElementById('help_hall');
let hall_help_block = document.getElementById('hall_help_block');
let help = document.getElementById('help');
let OK_stat_button = document.getElementById('OK_stat_button');
let friend_call = document.getElementById('friend_call');
let timer_p = document.getElementById('timer');
let tel_number = document.getElementById('tel_number');
let input_tel = document.getElementById('input_tel');
let timer_ok = document.getElementById('timer_ok');
let call_block = document.getElementById('call_block');
let friend_right_answer = document.getElementById('friend_right_answer');
let back_button = document.getElementById('back');


let start_audio = new Audio('hello-new-punter-2008-long.mp3');
let correct_answer_audio = new Audio('correct.mp3');
let wrong_answer_audio = new Audio('wrong.mp3');
let assist_audio = new Audio('assist.mp3');


async function fetchRandomQuestions() {
  try {
    const response = await fetch('/questions');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.game_questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

const getQuestionByLevel = async (level) => {
  // Формируем запрос
  const response = await fetch('/question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({level})
  });
  return response.json();
}

const postData = async (url = '', data = {}) => {
  // Формируем запрос
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

(async () => {


  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const answerButtons = [first_answer_button, second_answer_button, third_answer_button, fourth_answer_button];
  let mistake_possible = false;

  OK_stat_button.addEventListener('click', () => {
    help.classList.add('inactive');
    help.classList.remove('help');
    main_block.classList.remove('inactive');
  })

  start_button.addEventListener('click',() => {
    console.log(user_name.value);
    if (user_name.value != ''){
      start_block.classList.add('inactive');
      main_block.classList.remove('inactive');
      start_audio.play();
    }
    else{
      user_name.classList.add('warning_inp');
      warning.classList.remove('inactive');
    }
  })

  end_button.addEventListener('click', () => {
    window.location.href = '/';
  })

  questions = await fetchRandomQuestions();
  console.log(questions)
  let currentQuestionIndex = 0;

  function updateQuestion() {
    if (currentQuestionIndex >= questions.length) {
      right_answer.textContent = "Поздравляем! "
      won.textContent = "Вы выиграли 3 000 000!";

      main_block.classList.add('inactive');
      end_block.classList.add('game_end_block');
      end_block.classList.remove('inactive');

      postData('/game', {u_name: user_name.value,
        earned: 3000000})

      return;
    }

    answerButtons.forEach(button => button.disabled = false);
    answerButtons.forEach(button => button.classList.remove('incorrect'));

    question_num.textContent = "Вопрос под номером " + (currentQuestionIndex + 1);
    const question = questions[currentQuestionIndex];
    question_block.textContent = question.QuestionText;
    first_answer_button.textContent = "A: " + question.Answer1;
    second_answer_button.textContent = "B: " + question.Answer2;
    third_answer_button.textContent = "C: " + question.Answer3;
    fourth_answer_button.textContent = "D: " + question.Answer4;

    prizes[currentQuestionIndex].classList.add('current_prize');
  }

  updateQuestion();

  answerButtons.forEach(button => {
    button.addEventListener('click', () => {
      start_audio.pause();
      const selectedAnswer = parseInt(button.id);
      const correctAnswer = questions[currentQuestionIndex].RightAnswer;
      if (!mistake_possible){
        //button.classList.remove('incorrect');

        if (selectedAnswer === correctAnswer) {
          correct_answer_audio.play();
          console.log('Correct!');
          if (currentQuestionIndex < prizes.length){
            prizes[currentQuestionIndex].classList.remove('current_prize')
          }
          currentQuestionIndex++;
          updateQuestion();
        } else {
          wrong_answer_audio.play();
          console.log('Incorrect. The correct answer is:', correctAnswer);
          if (correctAnswer == 1){
            right_answer.textContent = "Правильный ответ A: " + questions[currentQuestionIndex].Answer1;
          }
          else if (correctAnswer == 2){
            right_answer.textContent = "Правильный ответ B: " + questions[currentQuestionIndex].Answer2;
          }
          else if (correctAnswer == 3){
            right_answer.textContent = "Правильный ответ C: " + questions[currentQuestionIndex].Answer3;
          }
          else if (correctAnswer == 4){
            right_answer.textContent = "Правильный ответ D: " + questions[currentQuestionIndex].Answer4;
          }
          console.log(safe_amount.value);
          console.log(prizes[currentQuestionIndex].textContent);
          let earned;
          if (parseInt(prizes[currentQuestionIndex].textContent.replaceAll(" ", "")) >= parseInt(safe_amount.value)){
            won.textContent = "Вы выиграли " + safe_amount.value;
            earned = parseInt(safe_amount.value);
          }
          else{
            won.textContent = "Вы выиграли 0";
            earned = 0
          }

          main_block.classList.add('inactive');
          end_block.classList.add('game_end_block');
          end_block.classList.remove('inactive');

          const userData = {
            u_name: user_name.value,
            earned: earned
          };
          console.log(user_name.value, earned)
          postData('/game', {u_name: user_name.value,
            earned: earned})
        }
      }
      else{
        if (selectedAnswer === correctAnswer){
          correct_answer_audio.play();
          console.log('Correct!');
          if (currentQuestionIndex < prizes.length){
            prizes[currentQuestionIndex].classList.remove('current_prize')
          }
          currentQuestionIndex++;
          updateQuestion();
        }else{
          button.classList.add('incorrect');
          wrong_answer_audio.play();
        }
        mistake_possible = false;
      }
    });
  });

  assist_50.addEventListener('click', () => {
    start_audio.pause();
    assist_audio.play();
    assist_50.classList.add('chosen');

    const incorrectAnswers = [];
    for (let i = 0; i < answerButtons.length; i++) {
      if (parseInt(answerButtons[i].id) !== questions[currentQuestionIndex].RightAnswer) {
        incorrectAnswers.push(answerButtons[i]);
      }
    }

    // Randomly remove one of the incorrect answers (to avoid always leaving the same two)
    const randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
    incorrectAnswers.splice(randomIndex, 1);

    incorrectAnswers.forEach(button => button.disabled = true);
    assist_50.disabled = true;
    console.log('50/50 hint used. Disabled incorrect buttons:', incorrectAnswers.map(button => button.textContent));
  })

  assist_change.addEventListener('click', async() => {
    start_audio.pause();
    assist_audio.play();
    assist_change.classList.add('chosen');
    const q = await getQuestionByLevel(currentQuestionIndex + 1);
    console.log(q.question);
    questions[currentQuestionIndex] = q.question;
    updateQuestion();
    assist_change.disabled = true;
  })

  assist_mistake.addEventListener('click', () => {
    start_audio.pause();
    assist_audio.play();
    assist_mistake.classList.add('chosen');
    mistake_possible = true;
    assist_mistake.disabled = true;
  })

  assist_hall.addEventListener('click', async () => {
    start_audio.pause();
    assist_audio.play();
    assist_hall.classList.add('chosen');
    function generateFictionalResults(correctAnswer) {
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      let ost = 100

      const percentages = [];
      for (let i = 0; i < 4; i++) {
        if (i === correctAnswer - 1) {
          percentages[i] = Math.floor(Math.random() * 60) + 40; // Range: 40% - 100%
          ost -= percentages[i]
        } else {
          percentages[i] = 0;
        }
      }

      for (let i = 0; i < 4; i++) {
        if (percentages[i] == 0) {
          percentages[i] = getRandomInt(0, ost);
          ost -= percentages[i]
        }
      }

      return percentages;
    }

    const per = generateFictionalResults(questions[currentQuestionIndex].RightAnswer);
    console.log(per)

    const simulatedResults = {
      A: per[0],
      B: per[1],
      C: per[2],
      D: per[3]
    };

    let options = {
      chart: {
        type: 'bar'
      },
      series: [{
        name: 'Ответы',
        data: Object.values(simulatedResults),
        //colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7']
      }],
      xaxis: {
        categories: ['A', 'B', 'C', 'D']
      }

    };

    let chart = new ApexCharts(document.querySelector("#hall_help_block"), options);
    await chart.render();

    help.classList.remove('inactive');
    help.classList.add('help');
    main_block.classList.add('inactive');

    assist_hall.disabled = true;
  })

  function generateRandomPhoneNumber() {
    // Создаем массив с доступными цифрами
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Генерируем первую цифру (всегда 7)
    const firstDigit = 7;

    // Генерируем остальные 9 цифр
    const remainingDigits = [];
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      remainingDigits.push(digits[randomIndex]);
    }

    // Объединяем все цифры в номер телефона
    const phoneNumber = `+7${firstDigit}${remainingDigits.join('')}`;

    // Возвращаем номер телефона
    return phoneNumber;
  }

  const telephone_num = generateRandomPhoneNumber();

  friend_call.addEventListener('click',() => {
    start_audio.pause();
    assist_audio.play();
    friend_call.classList.add('chosen');
    main_block.classList.add('inactive');
    call_block.classList.remove('inactive');
    call_block.classList.add('call_block');

    tel_number.textContent = "Введите номер: " + telephone_num;


    let time = 30; // Задаём время обратного отсчёта
    const timer = setInterval(() => {
      const countdownElement = timer_p; // Последим за элементом отсчёта
      if(time > 0) {
        countdownElement.textContent = `Оставшееся время на ввод: ${time--} секунд.`;
      } else {
        clearInterval(timer); // Заканчиваем работу таймера
        countdownElement.textContent = 'Время вышло'; // Сообщение о старте загрузки
        countdownElement.style.color = "red";
        timer_ok.disabled = true;
      }
    }, 1000);

    friend_call.disabled = true;
  })

  timer_ok.addEventListener('click', () => {
    if (input_tel.value === telephone_num){
      let answers = ['A', 'B', 'C', 'D'];
      const ra = answers[questions[currentQuestionIndex].RightAnswer - 1];
      friend_right_answer.textContent = `Правильный ответ: ${ra}.`;
      timer_ok.disabled = true;
    }else{
      friend_right_answer.textContent = 'Номер телефона введен неверно';
    }
  })

  back_button.addEventListener('click', () => {
    main_block.classList.remove('inactive');
    call_block.classList.add('inactive');
    call_block.classList.remove('call_block');
  })
})();


