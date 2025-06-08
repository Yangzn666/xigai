// timu.js

// 定义题库文件路径
const quizFiles = {
    0: '0.json',
    1: '1.json',
    2: '2.json',
    3: '3.json',
    4: '4.json',
    5: '5.json',
    6: '6.json',
    7: '7.json',
    8: '8.json',
    9: '9.json',
    10: '10.json',
    11: '11.json',
    12: '12.json',
    13: '13.json',
    14: '14.json',
    15: '15.json',
    16: '16.json',
    
};

// 初始化变量
let currentQuiz = null;
let currentQuestionIndex = 0;
let answeredCount = 0;
let score = 0;

// 获取DOM元素
const questionContainer = document.getElementById('question-container');
const submitButton = document.getElementById('submit-answer-button');
const feedbackElement = document.getElementById('feedback');
const answeredCountElement = document.getElementById('answered-count');
const scoreElement = document.getElementById('score');
const accuracyElement = document.getElementById('accuracy');
const quizSelect = document.getElementById('quiz-select');
const loadQuizButton = document.getElementById('load-quiz-button');

// 加载题库
function loadQuiz(quizNumber) {
    // 清空之前的题目
    questionContainer.innerHTML = '';
    feedbackElement.style.display = 'none';
    submitButton.disabled = true;
    answeredCount = 0;
    score = 0;
    currentQuestionIndex = 0;
    updateStats();

    // 检查是否选择了有效的题库
    if (!quizNumber || !quizFiles[quizNumber]) {
        alert('请选择一个有效的题库');
        return;
    }

    // 使用fetch API加载JSON文件
    fetch(quizFiles[quizNumber])
        .then(response => response.json())
        .then(data => {
            currentQuiz = data;
            if (currentQuiz.length > 0) {
                renderQuestion();
                submitButton.disabled = false;
            } else {
                questionContainer.innerHTML = '<p>题库为空</p>';
            }
        })
        .catch(error => {
            console.error('加载题库时出错:', error);
            alert('无法加载题库，请稍后再试');
        });
}

// 渲染单个题目
function renderQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    questionContainer.innerHTML = '';

    // 添加题目标题
    const questionTitle = document.createElement('h3');
    questionTitle.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
    questionContainer.appendChild(questionTitle);

    // 添加选项
    const optionsList = document.createElement('ul');
    question.options.forEach((option, index) => {
        const optionItem = document.createElement('li');
        const optionInput = document.createElement('input');
        optionInput.type = question.type === 'single' ? 'radio' : 'checkbox'; // 根据题型选择输入类型
        optionInput.name = 'answer';
        optionInput.value = index.toString(); // 将索引转换为字符串
        optionItem.appendChild(optionInput);
        const optionLabel = document.createElement('label');
        optionLabel.textContent = option;
        optionItem.appendChild(optionLabel);
        optionsList.appendChild(optionItem);
    });
    questionContainer.appendChild(optionsList);
}

// 判断答案是否正确
function checkAnswer() {
    const question = currentQuiz[currentQuestionIndex];
    let userAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked'))
        .map(input => parseInt(input.value)); // 获取用户选择的答案索引

    // 检查是否有未选择的选项
    if (userAnswers.length === 0) {
        alert('请选择一个或多个选项');
        return;
    }

    // 根据题型判断答案是否正确
    let isCorrect = false;
    if (question.type === 'single') {
        // 单选题：用户选择的唯一答案是否等于正确答案
        isCorrect = userAnswers.length === 1 && userAnswers[0] === question.correctAnswer;
    } else if (question.type === 'multiple') {
        // 多选题：用户选择的答案集合是否与正确答案集合相等
        isCorrect = arraysEqual(userAnswers.sort(), question.correctAnswer.sort());
    }

    // 更新统计数据
    answeredCount++;
    if (isCorrect) {
        score++;
        feedbackElement.className = 'feedback correct';
        feedbackElement.textContent = '回答正确！';
    } else {
        feedbackElement.className = 'feedback incorrect';
        feedbackElement.textContent = `回答错误，正确答案是：${question.explanation}`;
    }

    // 显示反馈信息
    feedbackElement.style.display = 'block';

    // 更新统计信息
    updateStats();

    // 如果还有题目，准备下一题
    if (currentQuestionIndex < currentQuiz.length - 1) {
        if (isCorrect) {
            // 如果回答正确，1.5秒后显示下一题
            setTimeout(() => {
                currentQuestionIndex++;
                renderQuestion();
                feedbackElement.style.display = 'none';
            }, 1500);
        } else {
            // 如果回答错误，7秒后显示下一题
            setTimeout(() => {
                currentQuestionIndex++;
                renderQuestion();
                feedbackElement.style.display = 'none';
            }, 7000); // 7秒
        }
    } else {
        // 所有题目已完成
        submitButton.disabled = true;
        feedbackElement.textContent = '所有题目已完成！';
    }
}

// 比较两个数组是否相等
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// 更新答题统计信息
function updateStats() {
    answeredCountElement.textContent = answeredCount;
    scoreElement.textContent = score;
    accuracyElement.textContent = answeredCount > 0 ? ((score / answeredCount) * 100).toFixed(2) + '%' : '0%';
}

// 处理题库选择
loadQuizButton.addEventListener('click', () => {
    const selectedQuiz = quizSelect.value;
    loadQuiz(selectedQuiz);
});

// 处理提交答案
submitButton.addEventListener('click', checkAnswer);