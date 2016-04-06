/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
//~日期：值
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
//~生成并插入div到aqi-chart-wrap中
//~div的width由粒度值定，height遍历chartData取得
function renderChart() {
    
    var chartWrap = document.getElementById("aqi-chart-wrap");
    var newNode = [];
    var nWidth;
    var i = 0;
    
    switch(pageState.nowGraTime){
        
        case "day" : nWidth = '1.1%' ; break;
        case "week" : nWidth = '7.69%' ; break;
        case "month" : nWidth = '25%' ; break;
        
    }
    
    chartWrap.innerHTML = '';
    
    for(var date in chartData){
        
        newNode[i] = document.createElement('div');
        newNode[i].style.height = chartData[date] + 'px';
        newNode[i].style.width = nWidth;
        newNode[i].style.top = 500 - chartData[date] + 'px';
        newNode[i].style.left = nWidth.replace("%","") * i + "%";
        newNode[i].style.background = 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+(Math.random()+2)/4+')';
        
        if(pageState.nowGraTime == "day"){
            
            newNode[i].title = date+'空气质量指数为'+chartData[date];
            
        }else if(pageState.nowGraTime == "week"){
            
            newNode[i].title = '第'+(i+1)+'周空气质量指数为'+chartData[date];
            
        }else if(pageState.nowGraTime == "month"){
            
            newNode[i].title = (i+1)+'月空气质量指数为'+chartData[date];
            
        }
        
        chartWrap.appendChild(newNode[i]);
        i++;
        
    }
    
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
//~根据粒度和城市取aqiSourceData中的对应数据，处理后列入chartData中
function graTimeChange() {
    
  // 确定是否选项发生了变化
    
    if(this.value == pageState.nowGraTime){
        
        return;
        
    }else{
        
        pageState.nowGraTime = this.value;
        
    }
    
  // 设置对应数据
    
    var date;
    var dateNum;
    var dateSum = 0;
    var i = 0;
    
    switch(pageState.nowGraTime){
        
        case "day" : dateNum = 1 ; break;
        case "week" : dateNum = 7 ; break;
        case "month" : dateNum = 30 ; break;
        
    }
    
    chartData = {};
    
    for(date in aqiSourceData[pageState.nowSelectCity]){
        
        dateSum += aqiSourceData[pageState.nowSelectCity][date];
        i ++;
        if(i == dateNum){
            
            chartData[date] = Math.ceil(dateSum / dateNum);
            dateSum = 0;
            i = 0;
            
        }
        
    }
    
    if(dateSum != 0){
        
        chartData[date] = dateSum / i;
        
    }
    
  // 调用图表渲染函数
    
    renderChart();
    
}

/**
 * select发生变化时的处理函数
 */
//~根据粒度和城市取aqiSourceData中的对应数据，处理后列入chartData中
function citySelectChange() {
  
  // 确定是否选项发生了变化
    
    if(this.value == pageState.nowSelectCity){
        
        return;
        
    }else{
        
        pageState.nowSelectCity = this.value;
        
    }
    
  // 设置对应数据
    
    var date;
    var dateNum;
    var dateSum = 0;
    var i = 0;
    
    switch(pageState.nowGraTime){
        
        case "day" : dateNum = 1 ; break;
        case "week" : dateNum = 7 ; break;
        case "month" : dateNum = 30 ; break;
          
    }
    
    chartData = {};
    
    for(date in aqiSourceData[pageState.nowSelectCity]){
        
        dateSum += aqiSourceData[pageState.nowSelectCity][date];
        i ++;
        
        if(i == dateNum){
            
            chartData[date] = dateSum / dateNum;
            dateSum = 0;
            i = 0;
            
        }
        
    }
    
    if(dateSum != 0){
        
        chartData[date] = dateSum / i;
        
    }
    
  // 调用图表渲染函数
    
    renderChart();
    
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    
    var oRadios = document.getElementById('form-gra-time').getElementsByTagName('input');
    
    for(var i = 0 ; i < oRadios.length ; i ++){
        
        oRadios[i].addEventListener('click',graTimeChange);
        
    }

}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    
    var oSelect = document.getElementById('city-select');
    var newNode = [];
    var i;
    
    for(var city in aqiSourceData){
        
        newNode[i] = document.createElement('option');
        newNode[i].innerHTML = city;
        newNode[i].value = city;
        oSelect.appendChild(newNode[i]);
        i++;
        
    }
    
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
    
    oSelect.addEventListener('change',citySelectChange);
    
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
}

init();