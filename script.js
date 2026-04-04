const SHANGHAI_TIME_ZONE = "Asia/Shanghai";
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const WEATHER_REFRESH_MS = 15 * MINUTE_MS;
const TARGET_DATE = { year: 2026, month: 4, day: 16 };
const TARGET_DAY_INDEX = toDayIndex(TARGET_DATE.year, TARGET_DATE.month, TARGET_DATE.day);

const QUOTES = [
  "先把标题写出来，讹文就不再是一团迷雾。",
  "不要等状态完美，先让光标开始跳动。",
  "先写粗糙版，修改永远比面对空白容易。",
  "不用一次写对，先把思路留在页面上。",
  "哪怕句子写得“笨”，也比一直不写强。",
  "讹文的阻力往往在开头，写下去，阻力就会变成惯性。",
  "不要和理想版本比，先和昨天的空白页拉开差距。",
  "删掉“必须写好”的包袱，换成“必须写完”的决心。",
  "第一稿的任务不是完美，而是存在。",
  "如果你觉得卡住了，就先写最垃圾的那一版。",
  "讹文不是一口气憋出来的，而是一段一段堆出来的。",
  "哪怕只改一个段落，讹文也在向前。",
  "今天推进半页，也比明天面对整页焦虑更有底气。",
  "稳住每日的匀速节奏，比偶尔的通宵爆发更有力量。",
  "把这一小节写完，再看下一节，别让全局吓住你。",
  "哪怕只写三行，也是在为结题清理障碍。",
  "每一个脚注的完善，都是在拉近你与学位的距离。",
  "不要预支明天的焦虑，只管完成今天的进度。",
  "冲刺不是百米赛跑，而是专注在每一个呼吸间的敲击。",
  "此时此刻坐下来的十分钟，含金量远胜焦虑的一小时。",
  "今天写下的一段，就是明天答辩时的一分底气。",
  "你现在积累的每一句，都会在终稿里熠熠生辉。",
  "文献看得再多，最终也要落回你自己的表达。",
  "你的论证，会在每一次“痛苦”的修改中变得无懈可击。",
  "把证据摆上来，法理的逻辑会慢慢跟上。",
  "写作遇到瓶颈时，先把逻辑提纲写出来，再往里填肉。",
  "每一个被推敲过的术语，都在定义你作为学者的专业度。",
  "别急着推翻自己，好思想往往就藏在那些粗糙的初稿里。",
  "写不顺的时候，试着给假想的观众讲一遍，再记下你的话。",
  "你的文字正在构建一个领域，而你就是那个规则的守护者。",
  "卡住时别评判自己，先把下一句写完。",
  "你不是在拖延，你是在等待一个更小的切入点。",
  "讹文的完成靠的是物理时间的累积，而不是灵光一现的奇迹。",
  "每一小时的绝对专注，都会换来最后交稿时的从容。",
  "感觉累是正常的，那是你正在突破学术极限的信号。",
  "暂时写不出来也没关系，站起来拉伸一下，光标还在等你。",
  "相信你过去三四年的积累，它们正通过你的指尖流淌出来。",
  "这十天的煎熬，是通往“博士”头衔的必经礼赞。",
  "把问题写下来，答案通常就会在笔尖跳出来。",
  "允许自己写出不完美的文字，但不允许自己停止思考。",
  "先完成，再精修，这是通往终点的唯一正路。",
  "今天的草稿，就是明天最重要的一章。",
  "想象一下十天后按下“发送”键那一刻的寂静与自由。",
  "这篇讹文不会伶随你一生，但写完它的韧性会。",
  "每一个字都在缩短你与“Doctor”这个称谓的物理距离。",
  "现在的每一行修改，都在为你未来的学术生涯筑基。",
  "你已经走过了几万字的长途，最后几千字只是惯性使然。",
  "最后十天，不是为了创造完美，而是为了完成使命。",
  "关掉社交软件，世界会等你，但讹文的截稿期不会。",
  "去写吧，为了那个在终点等待你的、更自由的自己。"
];

const WEATHER_CODE_MAP = {
  0: "晴朗",
  1: "基本晴",
  2: "局部多云",
  3: "阴天",
  45: "有雾",
  48: "雾凇",
  51: "小毛雨",
  53: "毛雨",
  55: "浓毛雨",
  56: "冻毛雨",
  57: "强冻毛雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  66: "冻雨",
  67: "强冻雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  77: "阵雪",
  80: "小阵雨",
  81: "阵雨",
  82: "强阵雨",
  85: "小阵雪",
  86: "强阵雪",
  95: "雷暴",
  96: "雷暴夹小冰雹",
  99: "强雷暴夹冰雹"
};

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: SHANGHAI_TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
});

let lunarFormatter = null;
try {
  lunarFormatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
    timeZone: SHANGHAI_TIME_ZONE,
    month: "long",
    day: "numeric"
  });
} catch (error) {
  lunarFormatter = null;
}

const timeFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: SHANGHAI_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

const dateTimePartsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: SHANGHAI_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
});

const countdownNumber = document.getElementById("countdownNumber");
const countdownLabel = document.getElementById("countdownLabel");
const todayDate = document.getElementById("todayDate");
const todayLunar = document.getElementById("todayLunar");
const todayMeta = document.getElementById("todayMeta");
const quoteText = document.getElementById("quoteText");
const quoteMeta = document.getElementById("quoteMeta");
const refreshQuoteButton = document.getElementById("refreshQuoteButton");
const weatherStatus = document.getElementById("weatherStatus");
const weatherData = document.getElementById("weatherData");
const weatherIcon = document.getElementById("weatherIcon");
const weatherSummary = document.getElementById("weatherSummary");
const weatherRange = document.getElementById("weatherRange");
const weatherUpdatedAt = document.getElementById("weatherUpdatedAt");
const refreshWeatherButton = document.getElementById("refreshWeatherButton");
const pageShell = document.querySelector(".page-shell");
const boardFit = document.querySelector(".board-fit");
const calendarBoard = document.querySelector(".calendar-board");

let hasWeatherData = false;
let currentQuoteIndex = -1;
let fitFrame = 0;

function toDayIndex(year, month, day) {
  return Math.floor(Date.UTC(year, month - 1, day) / DAY_MS);
}

function getShanghaiParts(date = new Date()) {
  return dateTimePartsFormatter.formatToParts(date).reduce((parts, token) => {
    if (token.type !== "literal") {
      parts[token.type] = Number(token.value);
    }

    return parts;
  }, {});
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function getWeatherDescription(code) {
  return WEATHER_CODE_MAP[code] ?? "天气平稳";
}

function toChineseNumber(value) {
  const numerals = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

  if (!Number.isFinite(value) || value < 0) {
    return String(value);
  }

  if (value < 10) {
    return numerals[value];
  }

  if (value < 20) {
    return value === 10 ? "十" : `十${numerals[value - 10]}`;
  }

  if (value < 100) {
    const tens = Math.floor(value / 10);
    const units = value % 10;
    return `${numerals[tens]}十${units === 0 ? "" : numerals[units]}`;
  }

  return String(value);
}

function getLunarText(date) {
  if (!lunarFormatter) {
    return "农历信息暂不可用";
  }

  try {
    const formatted = lunarFormatter.format(date);
    const normalized = formatted.replace(/\d+/g, (digits) => toChineseNumber(Number(digits)));
    const withDaySuffix = normalized.endsWith("日") ? normalized : `${normalized}日`;
    return `农历 ${withDaySuffix}`;
  } catch (error) {
    return "农历信息暂不可用";
  }
}

function getHourlyQuoteIndex(parts) {
  const hourlySeed = Number(`${parts.year}${pad(parts.month)}${pad(parts.day)}${pad(parts.hour)}`);
  const raw = Math.sin(hourlySeed) * 10000;
  const normalized = raw - Math.floor(raw);
  return Math.floor(normalized * QUOTES.length);
}

function getRandomQuoteIndex(excludedIndex) {
  if (QUOTES.length <= 1) {
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * QUOTES.length);
  while (nextIndex === excludedIndex) {
    nextIndex = Math.floor(Math.random() * QUOTES.length);
  }

  return nextIndex;
}

function renderQuote(index, metaText) {
  currentQuoteIndex = index;
  quoteText.textContent = QUOTES[index];
  quoteMeta.textContent = metaText;
  queueFitCalendar();
}

function getWeatherIconCategory(code) {
  if (code === 0 || code === 1) {
    return "sunny";
  }

  if ([2, 3].includes(code)) {
    return "cloudy";
  }

  if ([45, 48].includes(code)) {
    return "fog";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "snow";
  }

  if ([95, 96, 99].includes(code)) {
    return "thunder";
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "rain";
  }

  return "cloudy";
}

function getWeatherIconSvg(code) {
  const category = getWeatherIconCategory(code);
  const icons = {
    sunny: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="8"></circle>
        <path d="M24 5V11"></path>
        <path d="M24 37V43"></path>
        <path d="M5 24H11"></path>
        <path d="M37 24H43"></path>
        <path d="M10.6 10.6L14.8 14.8"></path>
        <path d="M33.2 33.2L37.4 37.4"></path>
        <path d="M10.6 37.4L14.8 33.2"></path>
        <path d="M33.2 14.8L37.4 10.6"></path>
      </svg>
    `,
    cloudy: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M14 34H35C39.4 34 43 30.8 43 26.8C43 22.8 39.8 19.7 35.8 19.7C35 13.7 29.9 9 23.7 9C17.7 9 12.7 13.3 11.6 19.1C7.4 19.6 4 23 4 27.2C4 31 7.3 34 11.3 34H14Z"></path>
      </svg>
    `,
    fog: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M13 24H34C37.7 24 40.8 21.2 41 17.7C41.2 14 38.2 11 34.6 11C33 8 29.9 6 26.4 6C21.5 6 17.5 10 17.3 14.8C13.6 15.2 10.7 18.3 10.7 22C10.7 22.7 10.8 23.3 11 24H13Z"></path>
        <path d="M8 31H40"></path>
        <path d="M5 37H34"></path>
        <path d="M15 43H43"></path>
      </svg>
    `,
    rain: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M14 26H35C39.4 26 43 22.8 43 18.8C43 14.8 39.8 11.7 35.8 11.7C35 5.7 29.9 1 23.7 1C17.7 1 12.7 5.3 11.6 11.1C7.4 11.6 4 15 4 19.2C4 23 7.3 26 11.3 26H14Z"></path>
        <path d="M16 32L13 38"></path>
        <path d="M24 32L21 40"></path>
        <path d="M32 32L29 38"></path>
      </svg>
    `,
    snow: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M14 24H35C39.4 24 43 20.8 43 16.8C43 12.8 39.8 9.7 35.8 9.7C35 3.7 29.9 -1 23.7 -1C17.7 -1 12.7 3.3 11.6 9.1C7.4 9.6 4 13 4 17.2C4 21 7.3 24 11.3 24H14Z"></path>
        <path d="M17 33H25"></path>
        <path d="M21 29V37"></path>
        <path d="M18.3 30.3L23.7 35.7"></path>
        <path d="M23.7 30.3L18.3 35.7"></path>
        <path d="M30 33H38"></path>
        <path d="M34 29V37"></path>
        <path d="M31.3 30.3L36.7 35.7"></path>
        <path d="M36.7 30.3L31.3 35.7"></path>
      </svg>
    `,
    thunder: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M14 24H35C39.4 24 43 20.8 43 16.8C43 12.8 39.8 9.7 35.8 9.7C35 3.7 29.9 -1 23.7 -1C17.7 -1 12.7 3.3 11.6 9.1C7.4 9.6 4 13 4 17.2C4 21 7.3 24 11.3 24H14Z"></path>
        <path d="M24 26L19 35H24L21 45L32 32H26L30 26H24Z"></path>
      </svg>
    `
  };

  return icons[category];
}

function setWeatherStatus(message, isError = false) {
  weatherStatus.hidden = false;
  weatherStatus.textContent = message;
  weatherStatus.classList.toggle("is-error", isError);
  queueFitCalendar();
}

function shouldUseLeaf3Mode() {
  const dpr = window.devicePixelRatio || 1;
  const shortEdge = Math.round(Math.min(window.screen.width, window.screen.height) * dpr);
  const longEdge = Math.round(Math.max(window.screen.width, window.screen.height) * dpr);
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const booxHint = /leaf|boox|onyx/i.test(navigator.userAgent);
  const cssShortEdge = Math.min(window.innerWidth, window.innerHeight);
  const cssLongEdge = Math.max(window.innerWidth, window.innerHeight);
  const cssRatio = cssLongEdge / Math.max(cssShortEdge, 1);
  const matchesLeaf3Resolution =
    Math.abs(shortEdge - 1264) <= 180 && Math.abs(longEdge - 1680) <= 180;
  const looksLikeLeafViewport =
    isPortrait && cssShortEdge <= 900 && cssRatio >= 1.25 && cssRatio <= 1.45;

  return matchesLeaf3Resolution || (booxHint && isPortrait) || looksLikeLeafViewport;
}

function fitCalendarToViewport() {
  if (!pageShell || !boardFit || !calendarBoard) {
    return;
  }

  const leaf3Mode = shouldUseLeaf3Mode();
  document.body.classList.toggle("leaf3-mode", leaf3Mode);

  if (!leaf3Mode) {
    boardFit.style.width = "";
    boardFit.style.height = "";
    calendarBoard.style.transform = "";
    return;
  }

  const visualViewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const visualViewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const safeInset = 16;
  calendarBoard.style.transform = "scale(1)";
  boardFit.style.width = "";
  boardFit.style.height = "";

  const naturalWidth = calendarBoard.offsetWidth;
  const naturalHeight = calendarBoard.offsetHeight;
  const availableWidth = Math.max(visualViewportWidth - safeInset, 0);
  const availableHeight = Math.max(visualViewportHeight - safeInset, 0);
  const scale = Math.min(availableWidth / naturalWidth, availableHeight / naturalHeight, 1);

  boardFit.style.width = `${Math.round(naturalWidth * scale)}px`;
  boardFit.style.height = `${Math.round(naturalHeight * scale)}px`;
  calendarBoard.style.transform = `scale(${scale})`;
}

function queueFitCalendar() {
  window.cancelAnimationFrame(fitFrame);
  fitFrame = window.requestAnimationFrame(fitCalendarToViewport);
}

function updateDateAndCountdown() {
  const now = new Date();
  const shanghaiParts = getShanghaiParts(now);
  const currentDayIndex = toDayIndex(shanghaiParts.year, shanghaiParts.month, shanghaiParts.day);
  const dayDelta = TARGET_DAY_INDEX - currentDayIndex;

  todayDate.textContent = dateFormatter.format(now);
  todayLunar.textContent = getLunarText(now);
  todayMeta.textContent = `北京时间 ${timeFormatter.format(now)}`;

  if (dayDelta > 0) {
    countdownNumber.textContent = String(dayDelta);
    countdownLabel.textContent = `距离目标日还有 ${dayDelta} 天。先推进一小段，今天这页就已经赢了。`;
    queueFitCalendar();
    return;
  }

  if (dayDelta === 0) {
    countdownNumber.textContent = "0";
    countdownLabel.textContent = "今天尕是目标日。稳住，先把最关键的一页写出来。";
    queueFitCalendar();
    return;
  }

  countdownNumber.textContent = String(Math.abs(dayDelta));
  countdownLabel.textContent = `目标日已过去 ${Math.abs(dayDelta)} 天。继续保持写作惯性，把收尾做扎实。`;
  queueFitCalendar();
}

function updateQuote() {
  const now = new Date();
  const shanghaiParts = getShanghaiParts(now);
  const quoteIndex = getHourlyQuoteIndex(shanghaiParts);
  renderQuote(
    quoteIndex,
    `按北京时间整点随机切换，当前句子更新时间：${pad(shanghaiParts.hour)}:00`
  );
}

function refreshQuoteManually() {
  const now = new Date();
  const shanghaiParts = getShanghaiParts(now);
  const nextIndex = getRandomQuoteIndex(currentQuoteIndex);
  renderQuote(
    nextIndex,
    `手动刷新于北京时间 ${pad(shanghaiParts.hour)}:${pad(shanghaiParts.minute)}`
  );
}

function scheduleAlignedTask(interval, task) {
  const run = () => {
    task();
    const delay = interval - (Date.now() % interval) + 60;
    window.setTimeout(run, delay);
  };

  const firstDelay = interval - (Date.now() % interval) + 60;
  window.setTimeout(run, firstDelay);
}

function formatWeatherTimestamp(rawTime) {
  if (!rawTime) {
    return "刚刚";
  }

  const [datePart = "", timePart = ""] = rawTime.split("T");
  const [, month = "--", day = "--"] = datePart.split("-");
  const [hour = "--", minute = "--"] = timePart.split(":");

  return `${month}/${day} ${hour}:${minute}`;
}

async function fetchWeather() {
  const apiUrl = new URL("https://api.open-meteo.com/v1/forecast");
  apiUrl.searchParams.set("latitude", "30.5928");
  apiUrl.searchParams.set("longitude", "114.3055");
  apiUrl.searchParams.set("current", "temperature_2m,weather_code");
  apiUrl.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code");
  apiUrl.searchParams.set("timezone", SHANGHAI_TIME_ZONE);
  apiUrl.searchParams.set("forecast_days", "1");

  refreshWeatherButton.disabled = true;

  if (!hasWeatherData) {
    setWeatherStatus("正在获取武汉天气...");
  } else {
    setWeatherStatus("正在刷新天气数据...");
  }

  try {
    const response = await fetch(apiUrl.toString(), { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Weather API responded with ${response.status}`);
    }

    const data = await response.json();
    const currentTemp = Math.round(data.current?.temperature_2m ?? 0);
    const currentCode = data.current?.weather_code ?? data.daily?.weather_code?.[0];
    const maxTemp = Math.round(data.daily?.temperature_2m_max?.[0] ?? 0);
    const minTemp = Math.round(data.daily?.temperature_2m_min?.[0] ?? 0);

    weatherIcon.innerHTML = getWeatherIconSvg(currentCode);
    weatherSummary.textContent = `${getWeatherDescription(currentCode)} · 当前 ${currentTemp}°C`;
    weatherRange.textContent = `今日气温 ${minTemp}°C 至 ${maxTemp}°C`;
    weatherUpdatedAt.textContent = `数据时间 ${formatWeatherTimestamp(data.current?.time)} · 每 15 分钟自动刷新`;

    hasWeatherData = true;
    weatherData.hidden = false;
    weatherStatus.hidden = true;
    weatherStatus.classList.remove("is-error");
  } catch (error) {
    if (hasWeatherData) {
      setWeatherStatus("天气刷新失败，已保留上一版数据。可点击右上角“刷新”重试。", true);
    } else {
      setWeatherStatus("天气暂时没连上。点击右上角“刷新”再试一次。", true);
      weatherData.hidden = true;
    }
  } finally {
    refreshWeatherButton.disabled = false;
    queueFitCalendar();
  }
}

refreshWeatherButton.addEventListener("click", () => {
  fetchWeather();
});

refreshQuoteButton.addEventListener("click", () => {
  refreshQuoteManually();
});

window.addEventListener("resize", queueFitCalendar);
window.addEventListener("orientationchange", queueFitCalendar);
window.addEventListener("load", queueFitCalendar);
window.visualViewport?.addEventListener("resize", queueFitCalendar);

updateDateAndCountdown();
updateQuote();
fetchWeather();
queueFitCalendar();

scheduleAlignedTask(MINUTE_MS, updateDateAndCountdown);
scheduleAlignedTask(HOUR_MS, updateQuote);
scheduleAlignedTask(WEATHER_REFRESH_MS, fetchWeather);
