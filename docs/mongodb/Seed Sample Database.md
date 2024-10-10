# Seed Sample Database

## Download Mongo DB Compass

- https://www.mongodb.com/try/download/compass

![](https://hackmd.io/_uploads/SyRSzRrJ1l.png)

## Create a Database

```
use demo
```

## Seed Categories Collection

```js
// 創建一個函數來生成 slug
function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

db.categories.drop();

// 創建主類別：家用電器
db.categories.insertOne({
  name: "家用電器",
  slug: generateSlug("家用電器"),
  description: "各種家庭使用的電器產品",
  parent: null,
  ancestor: null,
  image: "/images/categories/home-appliances.jpg",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

const homeAppliancesId = db.categories.findOne({name: "家用電器"})._id;

// 創建二級類別
const subCategories = [
  "廚房電器",
  "生活電器",
  "個人護理電器",
  "空調和暖氣設備",
  "娛樂電器"
];

subCategories.forEach(category => {
  db.categories.insertOne({
    name: category,
    slug: generateSlug(category),
    description: `${category}相關產品`,
    parent: homeAppliancesId,
    ancestor: homeAppliancesId,
    image: `/images/categories/${generateSlug(category)}.jpg`,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  })
});

// 創建三級類別
const thirdLevelCategories = [
  {parent: "廚房電器", categories: ["電鍋", "微波爐", "冰箱", "洗碗機"]},
  {parent: "生活電器", categories: ["洗衣機", "吸塵器", "電熨斗", "空氣清淨機"]},
  {parent: "個人護理電器", categories: ["吹風機", "電動牙刷", "電鬍刀"]},
  {parent: "空調和暖氣設備", categories: ["冷氣機", "電暖器", "除濕機"]},
  {parent: "娛樂電器", categories: ["電視", "音響系統", "遊戲機"]}
];

thirdLevelCategories.forEach(({parent, categories}) => {
  const parentId = db.categories.findOne({name: parent})._id;
  categories.forEach(category => {
    db.categories.insertOne({
      name: category,
      slug: generateSlug(category),
      description: `${category}相關產品`,
      parent: parentId,
      ancestor: parentId,
      image: `/images/categories/${generateSlug(category)}.jpg`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  });
});

// 驗證插入的數據
print("總類別數量：" + db.categories.count());
print("二級類別：");
db.categories.find({parent: homeAppliancesId}).forEach(c => print(" - " + c.name));
print("三級類別示例（廚房電器下）：");
const kitchenAppliancesId = db.categories.findOne({name: "廚房電器"})._id;
db.categories.find({parent: kitchenAppliancesId}).forEach(c => print(" - " + c.name));
```

## Seed Products Collection

```js
// 創建一個函數來生成唯一的 SKU
function generateSKU() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// 清空現有的產品集合（如果存在）
db.products.drop()

// 獲取所有類別
const categories = db.categories.find().toArray();

// 為每個三級類別創建產品
categories.forEach(category => {
  if (category.parent && category.ancestor) { // 只為三級類別創建產品
    let products;
    switch (category.name) {
      case "電鍋":
        products = [
          {name: "飛利浦智能電子鍋", description: "多功能電子鍋，容量5L", price: 2999},
          {name: "象印壓力鍋", description: "高壓煮食，省時省電", price: 3599},
          {name: "大同10人份電鍋", description: "傳統大同電鍋，耐用實惠", price: 1599},
          {name: "虎牌IH電子鍋", description: "IH加熱，多種煮飯模式", price: 4299},
          {name: "小米智能電飯煲", description: "app控制，60分鐘快煮", price: 1999},
          {name: "聲寶六人份電鍋", description: "小家庭首選，蒸煮兩用", price: 899},
          {name: "國際牌10人份電子鍋", description: "白金厚釜內鍋，保溫持久", price: 3799},
          {name: "東芝真空壓力IH電子鍋", description: "真空加壓技術，米飯更Q彈", price: 5299},
          {name: "美的電子壓力鍋", description: "一鍋多用，燉煮煎炒", price: 2499},
          {name: "尚朋堂數位觸控電子鍋", description: "24小時預約，黃金比例內鍋", price: 1799}
        ];
        break;
      case "微波爐":
        products = [
          {name: "國際牌變頻微波爐", description: "智能操作，多段火力", price: 3499},
          {name: "夏普水波爐", description: "水波加熱技術，均勻加熱", price: 4999},
          {name: "東芝燒烤微波爐", description: "微波燒烤二合一，多功能", price: 3899},
          {name: "美的平板微波爐", description: "簡約設計，易清潔", price: 2499},
          {name: "LG智能變頻微波爐", description: "智能感應，自動調節火力", price: 4599},
          {name: "三星智能微波爐", description: "熱風對流技術，均勻烘烤", price: 5299},
          {name: "惠而浦蒸氣微波爐", description: "蒸氣微波結合，營養保留", price: 4799},
          {name: "聲寶25L微波爐", description: "大容量，適合多人使用", price: 2999},
          {name: "日立燒烤微波爐", description: "上下雙層加熱，快速美味", price: 3699},
          {name: "歌林20L微波爐", description: "小巧實用，學生宿舍首選", price: 1999}
        ];
        break;
      case "冰箱":
        products = [
          {name: "LG對開門冰箱", description: "對開門設計，大容量", price: 25999},
          {name: "西門子多門冰箱", description: "多溫區控制，保鮮更持久", price: 32999},
          {name: "日立六門冰箱", description: "真空保鮮，節能省電", price: 39999},
          {name: "三星法式四門冰箱", description: "變頻壓縮機，快速製冰", price: 35999},
          {name: "伊萊克斯上下門冰箱", description: "適合小家庭，省空間設計", price: 18999},
          {name: "國際牌變頻三門冰箱", description: "nanoe™ X抑菌除臭技術", price: 28999},
          {name: "海爾四門變頻冰箱", description: "多重溫控，智能保鮮", price: 26999},
          {name: "東芝六門變頻冰箱", description: "超急速冷凍，鎖住食材新鮮", price: 41999},
          {name: "美國奇異對開門冰箱", description: "大容量製冰，美式設計", price: 37999},
          {name: "夏普日本進口冰箱", description: "真空絕緣板，節能省電", price: 45999}
        ];
        break;
      case "洗碗機":
        products = [
          {name: "博世獨立式洗碗機", description: "13人份容量，低噪音設計", price: 18999},
          {name: "美寧嵌入式洗碗機", description: "全自動洗滌，節水省電", price: 15999},
          {name: "西門子半嵌式洗碗機", description: "45公分窄身設計，適合小廚房", price: 16999},
          {name: "惠而浦桌上型洗碗機", description: "免安裝，小家庭首選", price: 9999},
          {name: "櫻花落地式洗碗機", description: "台灣製造，適合亞洲餐具", price: 13999},
          {name: "Miele全嵌式洗碗機", description: "德國品質，超靜音運作", price: 39999},
          {name: "AEG獨立式洗碗機", description: "智能感應，自動調節用水量", price: 21999},
          {name: "LG Steam智能洗碗機", description: "蒸氣洗淨，殺菌除臭", price: 23999},
          {name: "國際牌落地式洗碗機", description: "14人份大容量，適合大家庭", price: 19999},
          {name: "Fisher & Paykel雙層抽屜式洗碗機", description: "抽屜式設計，彈性使用", price: 28999}
        ];
        break;
      case "洗衣機":
        products = [
          {name: "三星滾筒洗衣機", description: "滾筒式，12公斤容量", price: 15999},
          {name: "惠而浦直立式洗衣機", description: "直立式，15公斤大容量", price: 13999},
          {name: "LG蒸氣洗脫烘洗衣機", description: "洗脫烘一體，18公斤", price: 39999},
          {name: "日立滾筒洗脫烘", description: "溫水噴霧去漬，10公斤", price: 25999},
          {name: "東元雙槽洗衣機", description: "雙槽設計，可同時洗兩種衣物", price: 6999},
          {name: "國際牌nanoe™ X除菌洗衣機", description: "抑菌除臭，16公斤", price: 29999},
          {name: "西門子iQ800滾筒洗衣機", description: "智能精準投放，14公斤", price: 35999},
          {name: "美泰克直立式洗衣機", description: "深層潔淨技術，17公斤", price: 16999},
          {name: "海爾迷你洗衣機", description: "3公斤，小坪數套房首選", price: 4999},
          {name: "AEG蒸氣護理洗衣機", description: "蒸氣呵護衣物，9公斤", price: 31999}
        ];
        break;
      case "吸塵器":
        products = [
          {name: "戴森無線吸塵器", description: "無線設計，強勁吸力", price: 16999},
          {name: "伊萊克斯掃地機器人", description: "智能規劃路徑，自動回充", price: 9999},
          {name: "LG圓筒式吸塵器", description: "強力渦旋氣旋，高效過濾", price: 5999},
          {name: "日立直立式吸塵器", description: "大吸力馬達，輕巧好推", price: 3999},
          {name: "飛利浦乾濕兩用吸塵器", description: "乾濕兩用，多功能配件", price: 4599},
          {name: "小米手持無線吸塵器", description: "輕量設計，多種吸頭", price: 7999},
          {name: "Miele旗艦吸塵器", description: "德國製造，超靜音設計", price: 24999},
          {name: "夏普自動倒垃圾掃地機器人", description: "自動倒垃圾，長時間清掃", price: 19999},
          {name: "iRobot Roomba掃地機器人", description: "智能導航，深度清潔", price: 14999},
          {name: "Bosch無線直立式吸塵器", description: "可更換電池，持久清潔", price: 11999}
        ];
        break;
      case "電熨斗":
        products = [
          {name: "飛利浦蒸氣電熨斗", description: "蒸氣熨斗，快速熨燙", price: 1299},
          {name: "東芝掛燙機", description: "直立式掛燙，適合各種衣物", price: 1599},
          {name: "Panasonic手持式蒸氣熨斗", description: "輕巧便攜，出差必備", price: 899},
          {name: "美的蒸氣熨斗", description: "大水箱設計，連續熨燙", price: 999},
          {name: "伊萊克斯蒸氣熨斗", description: "陶瓷底板，順滑熨燙", price: 1499},
          {name: "Tefal 蒸氣電熨斗", description: "防滴漏設計，安全熨燙", price: 1799},
          {name: "歌林折疊式熨斗", description: "摺疊收納，攜帶方便", price: 699},
          {name: "日立蒸氣熨斗", description: "強力蒸氣，快速去皺", price: 1399},
          {name: "國際牌蒸氣電熨斗", description: "多孔底板，蒸氣分布均勻", price: 1699},
          {name: "德國百靈掛燙機", description: "大容量水箱，持續蒸氣輸出", price: 2299}
        ];
        break;
      case "空氣清淨機":
        products = [
          {name: "小米空氣清淨機", description: "高效過濾，智能控制", price: 4999},
          {name: "Dyson空氣清淨風扇", description: "淨化與送風二合一", price: 16999},
          {name: "飛利浦奈米級空氣清淨機", description: "奈米級過濾，除菌除臭", price: 8999},
          {name: "夏普蚊取空氣清淨機", description: "清淨空氣同時捕蚊", price: 7999},
          {name: "Blueair空氣清淨機", description: "靜音設計，適合臥室使用", price: 11999},
          {name: "LG PuriCare 360°空氣清淨機", description: "360度循環淨化，覆蓋範圍大", price: 19999},
          {name: "Honeywell 智能空氣清淨機", description: "App遠端控制，自動偵測空氣品質", price: 9999},
          {name: "伊萊克斯HEPA空氣清淨機", description: "HEPA濾網，99.97%過濾效果", price: 6999},
          {name: "Coway 綠淨力空氣清淨機", description: "四層過濾，省電節能", price: 8499},
          {name: "3M 淨呼吸空氣清淨機", description: "靜電濾網技術，高效過濾", price: 5999}
        ];
        break;
      case "吹風機":
        products = [
          {name: "Panasonic奈米水離子吹風機", description: "奈米水離子技術，護髮設計", price: 2499},
          {name: "Dyson超音速吹風機", description: "智能溫控，快速乾髮", price: 14900},
          {name: "飛利浦溫控護髮吹風機", description: "智能溫控，防止過熱損傷", price: 1999},
          {name: "日本熊野油脂負離子吹風機", description: "負離子技術，頭髮柔順亮澤", price: 999},
          {name: "Vidal Sassoon沙龍級吹風機", description: "專業級性能，多種風速設定", price: 1299},
          {name: "Conair 摺疊式吹風機", description: "輕巧摺疊，旅行必備", price: 799},
          {name: "雷明登專業級吹風機", description: "強力風速，快速乾髮", price: 1599},
          {name: "夏普離子吹風機", description: "離子技術，減少靜電糾結", price: 2299},
          {name: "Braun 靜音吹風機", description: "超靜音設計，不打擾他人", price: 1799},
          {name: "GHD專業造型吹風機", description: "沙龍級性能，附造型風嘴", price: 4999}
        ];
        break;
      case "電動牙刷":
        products = [
          {name: "歐樂B 3D電動牙刷", description: "3D清潔技術，多種刷頭", price: 1999},
          {name: "飛利浦音波電動牙刷", description: "音波震動技術，深層清潔", price: 2499},
          {name: "Panasonic 音波電動牙刷", description: "超音波振動，溫和潔牙", price: 1799},
          {name: "米家聲波電動牙刷", description: "高頻震動，智能監測刷牙時間", price: 999},
          {name: "Waterpik 沖牙機組合電動牙刷", description: "刷牙加沖牙，全方位口腔護理", price: 3999},
          {name: "日本 Marvis 電動牙刷", description: "時尚設計，多種模式選擇", price: 1599},
          {name: "德國 SEAGO 聲波電動牙刷", description: "五種模式，智能計時", price: 899},
          {name: "韓國 Amore Pacific 電動牙刷", description: "柔軟刷毛，適合敏感牙齦", price: 1299},
          {name: "瑞士 CURAPROX 聲波電動牙刷", description: "超細軟毛，深入清潔", price: 2299},
          {name: "日本 Ionpa 負離子電動牙刷", description: "負離子技術，有效去除牙菌斑", price: 1899}
        ];
        break;
      case "電鬍刀":
        products = [
          {name: "飛利浦電鬍刀", description: "水洗設計，全方位刀頭", price: 2799},
          {name: "百靈水洗電鬍刀", description: "三刀頭設計，貼合面部", price: 1999},
          {name: "Panasonic 五刀頭電鬍刀", description: "五刀頭設計，快速剃鬍", price: 3499},
          {name: "日立電鬍刀", description: "可水洗，乾濕兩用", price: 1599},
          {name: "小米電動刮鬍刀", description: "一小時快充，續航力強", price: 999},
          {name: "樂美雅三刀頭電鬍刀", description: "浮動刀頭，適應臉部輪廓", price: 1299},
          {name: "德國博朗 Series 9 電鬍刀", description: "智能聲波技術，深層清潔", price: 8999},
          {name: "日本 Izumi 四刀頭電鬍刀", description: "四刀頭設計，高效剃鬍", price: 2299},
          {name: "雷明登鈦金塗層電鬍刀", description: "鈦金塗層，減少皮膚刺激", price: 1799},
          {name: "WAHL 電動理髮器電鬍刀二合一", description: "多功能設計，剃鬍理髮兩用", price: 1499}
        ];
        break;
      case "冷氣機":
        products = [
          {name: "大金變頻冷氣", description: "變頻省電，快速製冷", price: 29999},
          {name: "三菱重工冷暖空調", description: "冷暖兩用，全年適用", price: 25999},
          {name: "日立頂級變頻冷氣", description: "奈米銀離子抗菌，靜音運轉", price: 32999},
          {name: "國際牌nanoe™ X變頻冷氣", description: "nanoe™ X技術，淨化空氣", price: 28999},
          {name: "聲寶雲端智慧變頻冷氣", description: "Wi-Fi控制，遠端遙控", price: 23999},
          {name: "LG雙迴轉變頻冷氣", description: "雙迴轉壓縮機，快速降溫", price: 27999},
          {name: "東元一對一變頻冷氣", description: "DC變頻，節能省電", price: 21999},
          {name: "華菱變頻冷暖空調", description: "冷暖兩用，經濟實惠", price: 19999},
          {name: "富士通變頻分離式冷氣", description: "日本技術，靜音舒適", price: 26999},
          {name: "禾聯環保冷媒變頻冷氣", description: "環保冷媒，低碳節能", price: 20999}
        ];
        break;
      case "電暖器":
        products = [
          {name: "德龍葉片式電暖器", description: "對流式加熱，安全防傾倒", price: 3999},
          {name: "北方電子式電暖器", description: "多段溫控，節能省電", price: 2999},
          {name: "嘉儀陶瓷電暖器", description: "PTC陶瓷發熱，速熱省電", price: 1599},
          {name: "聲寶電膜式電暖器", description: "輕薄設計，牆掛/立式兩用", price: 2499},
          {name: "勳風智能陶瓷電暖器", description: "智能恆溫，定時關機", price: 1999},
          {name: "迪朗奇葉片式電暖器", description: "義大利設計，靜音運作", price: 4599},
          {name: "歐頓即熱式電暖器", description: "即開即熱，浴室適用", price: 1299},
          {name: "惠而浦電子式電暖器", description: "LCD顯示，精準控溫", price: 2799},
          {name: "尚朋堂碳素電暖器", description: "碳素發熱，遠紅外線效果", price: 1799},
          {name: "良將直立式電暖器", description: "擺頭設計，大範圍加熱", price: 2299}
        ];
        break;
      case "除濕機":
        products = [
          {name: "三菱除濕機", description: "大容量，智能濕度控制", price: 8999},
          {name: "夏普除濕機", description: "乾衣除濕兩用，一機多功", price: 7999},
          {name: "國際牌nanoe™ X除濕機", description: "nanoe™ X技術，抑制黴菌", price: 9999},
          {name: "日立除濕機", description: "智能濕度感應，自動調節", price: 8599},
          {name: "美寧除濕機", description: "台灣製造，省電節能", price: 6999},
          {name: "惠而浦除濕機", description: "強力除濕，適合大空間", price: 7599},
          {name: "德國百靈除濕機", description: "靜音設計，臥室適用", price: 10999},
          {name: "佳醫除濕機", description: "活性碳濾網，除濕除臭", price: 5999},
          {name: "聲寶除濕機", description: "連續排水，長時間使用", price: 6599},
          {name: "克立淨除濕機", description: "負離子淨化，提升空氣品質", price: 7299}
        ];
        break;
      case "電視":
        products = [
          {name: "Sony 4K OLED電視", description: "65吋OLED螢幕，HDR技術", price: 59999},
          {name: "三星 QLED量子電視", description: "75吋大螢幕，量子點技術", price: 69999},
          {name: "LG NanoCell電視", description: "55吋4K解析度，廣色域顯示", price: 29999},
          {name: "TCL Mini-LED電視", description: "65吋8K解析度，Mini-LED背光", price: 39999},
          {name: "飛利浦 Ambilight電視", description: "55吋4K HDR，Ambilight情境燈", price: 32999},
          {name: "Sharp 8K電視", description: "70吋8K解析度，AI畫質優化", price: 89999},
          {name: "Hisense ULED電視", description: "65吋4K HDR，量子點色彩", price: 35999},
          {name: "Panasonic OLED電視", description: "55吋OLED，電影級畫質", price: 54999},
          {name: "Vizio P系列量子電視", description: "75吋4K HDR，120Hz更新率", price: 49999},
          {name: "創維 OLED電視", description: "65吋4K OLED，AI語音控制", price: 45999}
        ];
        break;
      case "音響系統":
        products = [
          {name: "Bose家庭劇院系統", description: "5.1聲道環繞音效", price: 39999},
          {name: "Sonos無線音響系統", description: "多房間串流，簡易設置", price: 29999},
          {name: "Yamaha 7.2聲道AV擴大機", description: "7.2聲道，4K HDR支援", price: 24999},
          {name: "Harman Kardon 5.1聲道條形音箱", description: "無線重低音，藍牙連接", price: 19999},
          {name: "Denon 家庭劇院系統", description: "Dolby Atmos支援，HEOS多房間", price: 34999},
          {name: "JBL 9.1聲道條形音箱", description: "無線環繞音效，Dolby Atmos", price: 27999},
          {name: "Sony 7.1.2聲道家庭劇院", description: "Dolby Atmos，DTS:X支援", price: 32999},
          {name: "KEF LS50 Wireless II音響系統", description: "無線Hi-Fi，app控制", price: 49999},
          {name: "Klipsch 5.1聲道家庭劇院", description: "號角式高音，強勁低音", price: 35999},
          {name: "Marantz 7.2聲道AV擴大機", description: "8K視頻支援，HEOS內建", price: 29999}
        ];
        break;
      case "遊戲機":
        products = [
          {name: "Sony PlayStation 5", description: "次世代遊戲主機，4K遊戲體驗", price: 15900},
          {name: "Nintendo Switch", description: "便攜式遊戲主機，多人遊戲", price: 9999},
          {name: "Microsoft Xbox Series X", description: "4K遊戲，向下相容", price: 16900},
          {name: "Nintendo Switch Lite", description: "輕量版Switch，純掌上模式", price: 6999},
          {name: "Sony PlayStation 4 Pro", description: "4K遊戲支援，大量遊戲庫", price: 10900},
          {name: "Microsoft Xbox Series S", description: "數位版次世代主機，1440p遊戲", price: 9999},
          {name: "Atari VCS", description: "復古風格，現代性能", price: 12999},
          {name: "SEGA Genesis Mini", description: "內建42款經典遊戲", price: 2999},
          {name: "Nintendo 2DS XL", description: "大螢幕掌機，豐富3DS遊戲庫", price: 4999},
          {name: "Intellivision Amico", description: "家庭友善遊戲主機，適合多人同樂", price: 8999}
        ];
        break;
      default:
        products = [];
    }

    // 插入產品到數據庫
    products.forEach(product => {
      db.products.insertOne({
        ...product,
        sku: generateSKU(),
        categoryId: category._id,
        stock: Math.floor(Math.random() * 100) + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  }
});
```

## Seed Orders Collection

```js
// 獲取所有產品
const products = db.products.find().toArray();

// 生成隨機姓名的函數
function generateName() {
  const surnames = ['張', '李', '王', '劉', '陳', '楊', '黃', '趙', '吳', '周'];
  const names = ['小明', '小華', '小芳', '小強', '小美', '小龍', '小琳', '小傑', '小雯', '小軒'];
  return surnames[Math.floor(Math.random() * surnames.length)] + names[Math.floor(Math.random() * names.length)];
}

// 生成隨機電話號碼的函數
function generatePhone() {
  return '09' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
}

// 生成隨機地址的函數
function generateAddress() {
  const streets = ['中山路', '忠孝東路', '信義路', '復興南路', '民生東路'];
  const cities = ['台北市', '新北市', '桃園市', '台中市', '高雄市'];
  const states = ['台北', '新北', '桃園', '台中', '高雄'];
  const zipCodes = ['100', '220', '330', '400', '800'];

  const streetIndex = Math.floor(Math.random() * streets.length);
  return {
    street: streets[streetIndex] + Math.floor(Math.random() * 200 + 1) + '號',
    city: cities[streetIndex],
    state: states[streetIndex],
    zipCode: zipCodes[streetIndex],
    country: '台灣'
  };
}

// 生成訂單
const orders = [];

for (let i = 0; i < 100; i++) {
  const itemCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 items per order
  const items = [];
  let totalAmount = 0;

  for (let j = 0; j < itemCount; j++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 quantity
    const subtotal = product.price * quantity;
    totalAmount += subtotal;

    items.push({
      productItem: {
        productId: product._id,
        sku: product.sku,
        name: product.name,
        price: product.price
      },
      quantity: quantity,
      subtotal: subtotal
    });
  }

  const orderDate = new Date();
  const order = {
    customer: {
      name: generateName(),
      email: 'ckyang0623@gmail.com',
      phone: generatePhone(),
      address: generateAddress()
    },
    items: items,
    orderInfo: {
      orderNumber: 'ORD' + (i + 1).toString().padStart(3, '0'),
      orderDate: orderDate,
      totalAmount: totalAmount,
      status: 'done',
      paymentMethod: ['信用卡', 'PayPal', '銀行轉帳'][Math.floor(Math.random() * 3)],
      paymentStatus: 'paid'
    },
    shippingInfo: {
      method: ['標準配送', '快速配送'][Math.floor(Math.random() * 2)],
      trackingNumber: 'TRK' + (i + 1).toString().padStart(3, '0'),
      estimatedDeliveryDate: new Date()
    },
    createdAt: new Date()
  };
  orders.push(order);
}

// 插入訂單到數據庫
db.orders.insertMany(orders);

// 驗證插入的數據
print("總訂單數量：" + db.orders.count());
```

## Embedding and Referencing

```
db.orders.findOne();
```

```
{
  _id: ObjectId('67084735c600877955d91cb8'),
  customer: {
    name: '周小軒',
    email: 'ckyang0623@gmail.com',
    phone: '0980976948',
    address: {
      street: '民生東路139號',
      city: '高雄市',
      state: '高雄',
      zipCode: '800',
      country: '台灣'
    }
  },
  items: [
    {
      productItem: {
        productId: ObjectId('670846fbc600877955d91c9f'),
        sku: 'SK548EWS',
        name: 'Sharp 8K電視',
        price: 89999
      },
      quantity: 2,
      subtotal: 179998
    },
    {
      productItem: {
        productId: ObjectId('670846f8c600877955d91c4e'),
        sku: 'PCEHQZ2Q',
        name: '伊萊克斯蒸氣熨斗',
        price: 1499
      },
      quantity: 3,
      subtotal: 4497
    },
    {
      productItem: {
        productId: ObjectId('670846f8c600877955d91c57'),
        sku: '972TFSOO',
        name: '夏普蚊取空氣清淨機',
        price: 7999
      },
      quantity: 1,
      subtotal: 7999
    }
  ],
  orderInfo: {
    orderNumber: 'ORD001',
    orderDate: 2024-10-10T21:29:25.219Z,
    totalAmount: 192494,
    status: 'done',
    paymentMethod: '信用卡',
    paymentStatus: 'paid'
  },
  shippingInfo: {
    method: '標準配送',
    trackingNumber: 'TRK001',
    estimatedDeliveryDate: 2024-10-10T21:29:25.220Z
  },
  createdAt: 2024-10-10T21:29:25.220Z
}
```

::: info

這個例子很好地展示了 MongoDB 中的 embedding（嵌入）和 reference（引用）概念。

1. Embedding（嵌入）:

嵌入是指將相關的數據直接嵌入到文檔中，作為該文檔的一個字段。在這個例子中，我們可以看到多個嵌入的實例：

a) 客戶信息：

```
"customer": {
  "name": "周小軒",
  "email": "ckyang0623@gmail.com",
  "phone": "0980976948",
  "address": {
    "street": "民生東路139號",
    "city": "高雄市",
    "state": "高雄",
    "zipCode": "800",
    "country": "台灣"
  }
}
```

客戶的詳細信息，包括地址，都直接嵌入在主文檔中。

b) 訂單項目：

```
"items": [
  {
    "productItem": {
      "productId": ObjectId("670846fbc600877955d91c9f"),
      "sku": "SK548EWS",
      "name": "Sharp 8K電視",
      "price": 89999
    },
    "quantity": 2,
    "subtotal": 179998
  },
  // ... 其他項目
]
```

每個訂單項目都包含了產品的詳細信息，直接嵌入在 items 數組中。

c) 訂單信息和配送信息：

```
"orderInfo": {
  "orderNumber": "ORD001",
  "orderDate": 2024-10-10T21:29:25.219Z,
  "totalAmount": 192494,
  "status": "done",
  "paymentMethod": "信用卡",
  "paymentStatus": "paid"
},
"shippingInfo": {
  "method": "標準配送",
  "trackingNumber": "TRK001",
  "estimatedDeliveryDate": 2024-10-10T21:29:25.220Z
}
```

這些信息也都直接嵌入在主文檔中。

嵌入的優點是可以在一次查詢中獲取所有相關數據，提高讀取效率。缺點是可能導致文檔過大，且更新嵌入文檔中的數據可能較為複雜。

2. Reference（引用）:

引用是指通過存儲其他文檔的 ID 來引用它們，而不是直接嵌入數據。在這個例子中，我們可以看到引用的使用：

```
"productItem": {
  "productId": ObjectId("670846fbc600877955d91c9f"),
}
```

這裡，`productId` 是對另一個集合中產品文檔的引用。這允許我們：

- 保持產品信息的一致性（如果產品信息更新，不需要更新所有訂單）
- 減少數據重複
- 允許更靈活的數據結構

使用引用的缺點是可能需要額外的查詢來獲取完整的產品信息。

在實際應用中，我們通常會根據數據的使用模式、更新頻率和查詢需求來決定使用嵌入還是引用。這個例子展示了兩種方法的混合使用，這在實際應用中很常見，以平衡性能和靈活性。

:::

::: details 若以關聯式資料庫會如何設計

```sql
-- 客戶表
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);

-- 地址表
CREATE TABLE addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    street VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 產品表
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(50),
    name VARCHAR(200),
    price DECIMAL(10, 2)
);

-- 訂單表
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    order_number VARCHAR(50),
    order_date DATETIME,
    total_amount DECIMAL(10, 2),
    status VARCHAR(50),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    created_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 訂單項目表
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    subtotal DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 配送信息表
CREATE TABLE shipping_info (
    shipping_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    method VARCHAR(100),
    tracking_number VARCHAR(100),
    estimated_delivery_date DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
```

:::

## Simple CRUD Operations

### Create

- InsertOne
- InsertMany
  
::: details Create Order

```js

db.orders.insertOne({
  customer: {
    name: '李小明',
    email: 'lixiaoming@example.com',
    phone: '0912345678',
    address: {
      street: '中山路100號',
      city: '台北市',
      state: '台北',
      zipCode: '100',
      country: '台灣'
    }
  },
  items: [
    {
      productItem: {
        productId: ObjectId('5f8a7b2e1c9d440000a1e345'),
        sku: 'LT789XYZ',
        name: 'Apple MacBook Pro',
        price: 52900
      },
      quantity: 1,
      subtotal: 52900
    }
  ],
  orderInfo: {
    orderNumber: 'ORD002',
    orderDate: new Date(),
    totalAmount: 52900,
    status: 'pending',
    paymentMethod: '信用卡',
    paymentStatus: 'pending'
  },
  shippingInfo: {
    method: '快速配送',
    trackingNumber: 'TRK002',
    estimatedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 3))
  },
  createdAt: new Date()
})
```

```
db.orders.insertMany([
  {
    customer: {
      name: '王大華',
      email: 'wangdahua@example.com',
      phone: '0923456789',
      address: {
        street: '忠孝東路200號',
        city: '台北市',
        state: '台北',
        zipCode: '106',
        country: '台灣'
      }
    },
    items: [
      {
        productItem: {
          productId: ObjectId('5f8a7b2e1c9d440000a1e346'),
          sku: 'PH123ABC',
          name: 'iPhone 13 Pro',
          price: 32900
        },
        quantity: 1,
        subtotal: 32900
      }
    ],
    orderInfo: {
      orderNumber: 'ORD003',
      orderDate: new Date(),
      totalAmount: 32900,
      status: 'processing',
      paymentMethod: 'PayPal',
      paymentStatus: 'paid'
    },
    shippingInfo: {
      method: '標準配送',
      trackingNumber: 'TRK003',
      estimatedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 5))
    },
    createdAt: new Date()
  },
  {
    customer: {
      name: '陳小琳',
      email: 'chenxiaolin@example.com',
      phone: '0934567890',
      address: {
        street: '復興南路300號',
        city: '台北市',
        state: '台北',
        zipCode: '106',
        country: '台灣'
      }
    },
    items: [
      {
        productItem: {
          productId: ObjectId('5f8a7b2e1c9d440000a1e347'),
          sku: 'TV456DEF',
          name: 'Samsung QLED TV',
          price: 45900
        },
        quantity: 1,
        subtotal: 45900
      },
      {
        productItem: {
          productId: ObjectId('5f8a7b2e1c9d440000a1e348'),
          sku: 'SP789GHI',
          name: 'Bose SoundLink',
          price: 3999
        },
        quantity: 2,
        subtotal: 7998
      }
    ],
    orderInfo: {
      orderNumber: 'ORD004',
      orderDate: new Date(),
      totalAmount: 53898,
      status: 'shipped',
      paymentMethod: '信用卡',
      paymentStatus: 'paid'
    },
    shippingInfo: {
      method: '快速配送',
      trackingNumber: 'TRK004',
      estimatedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 2))
    },
    createdAt: new Date()
  }
])
```

:::


### Find

#### comparison operators

- $eq
- $ne
- $gt
- $gte
- $lt
- $lte
- $in
- $nin
- ...

#### logical operators

- $and
- $or
- $not

#### query array

- $all
- $elemMatch

#### findOne with projection

- findOne({ filter }, { projection })

::: details
好的,我來為您詳細解釋 MongoDB 的查詢語法,並使用您提供的文檔結構作為示例。

1. 比較運算符

- $eq: 等於

```javascript
db.collection.find({"customer.name": {$eq: "周小軒"}})
```

- $ne: 不等於

```javascript
db.collection.find({"orderInfo.status": {$ne: "pending"}})
```

- $gt: 大於

```javascript
db.collection.find({"orderInfo.totalAmount": {$gt: 100000}})
```

- $gte: 大於等於

```javascript
db.collection.find({"orderInfo.totalAmount": {$gte: 192494}})
```

- $lt: 小於

```javascript
db.collection.find({"items.quantity": {$lt: 3}})
```

- $lte: 小於等於

```javascript
db.collection.find({"items.quantity": {$lte: 2}})
```

- $in: 在指定數組中

```javascript
db.collection.find({"customer.address.city": {$in: ["高雄市", "台北市", "台中市"]}})
```

- $nin: 不在指定數組中

```javascript
db.collection.find({"orderInfo.paymentMethod": {$nin: ["現金", "PayPal"]}})
```

2. 邏輯運算符

- $and: 邏輯與

```javascript
db.collection.find({
  $and: [
    {"orderInfo.totalAmount": {$gt: 100000}},
    {"orderInfo.status": "done"}
  ]
})
```

- $or: 邏輯或

```javascript
db.collection.find({
  $or: [
    {"customer.address.city": "高雄市"},
    {"customer.address.city": "台北市"}
  ]
})
```

- $not: 邏輯非

```javascript
db.collection.find({
  "orderInfo.paymentStatus": {$not: {$eq: "pending"}}
})
```

3. 查詢數組

- $all: 匹配數組中所有指定元素

```javascript
db.collection.find({
  "items.productItem.name": {$all: ["Sharp 8K電視", "夏普蚊取空氣清淨機"]}
})
```

- $elemMatch: 匹配數組中至少一個元素滿足所有指定條件

```javascript
db.collection.find({
  "items": {
    $elemMatch: {
      "productItem.price": {$gt: 50000},
      "quantity": {$gte: 2}
    }
  }
})
```

4. findOne 與投影

findOne() 方法用於返回符合條件的第一個文檔。投影用於指定返回的字段。

```javascript
db.collection.findOne(
  {"customer.name": "周小軒"},
  {
    "customer.name": 1,
    "customer.email": 1,
    "orderInfo.orderNumber": 1,
    "orderInfo.totalAmount": 1,
    _id: 0
  }
)
```

這個查詢會返回名為 "周小軒" 的客戶的訂單,只包含客戶名稱、電子郵件、訂單號和總金額,不包含 _id 字段。

這些示例涵蓋了您提到的大部分 MongoDB 查詢語法。您可以根據實際需求組合使用這些運算符來構建更複雜的查詢。如果您有任何特定的查詢需求或需要更多解釋,請隨時告訴我。

:::

### Update

- updateOne

```js
db.orders.updateOne(
  { "orderInfo.orderNumber": "ORD001" },
  {
    $set: { "orderInfo.status": "shipped" },
    $currentDate: { "orderInfo.updatedAt": true }
  }
)
```

- findAndModify
- updateMany
- deleteOne
- deleteMany

::: details

非常好,我來為您詳細解釋這些 MongoDB 操作方法,並使用之前的訂單文檔結構作為示例。

1. updateOne

updateOne() 方法用於更新集合中符合條件的第一個文檔。

語法:
```javascript
db.collection.updateOne(filter, update, options)
```

示例:
```javascript
db.orders.updateOne(
  { "orderInfo.orderNumber": "ORD001" },
  { 
    $set: { 
      "orderInfo.status": "shipped",
      "shippingInfo.trackingNumber": "TRK001-UPDATE"
    },
    $currentDate: { "orderInfo.lastModified": true }
  }
)
```
這個操作會更新訂單號為 "ORD001" 的訂單狀態為 "shipped",更新追踪號碼,並添加一個最後修改日期。

2. findAndModify

findAndModify() 方法用於查找並修改單個文檔。它可以在一個原子操作中更新文檔並返回更新前或更新後的文檔。

語法:
```
db.collection.findAndModify({
  query: <document>,
  sort: <document>,
  update: <document>,
  new: <boolean>,
  fields: <document>,
  upsert: <boolean>,
});
```

示例:
```javascript
db.orders.findAndModify({
  query: { "orderInfo.orderNumber": "ORD002" },
  update: { 
    $set: { "orderInfo.status": "processing" }
  },
  new: true,
  fields: { 
    "orderInfo.orderNumber": 1, 
    "orderInfo.status": 1, 
    "items.quantity": 1 
  }
})
```
這個操作會查找訂單號為 "ORD002" 的訂單,將狀態更新為 "processing",所有商品數量加 1,並返回更新後的部分字段。

3. updateMany

updateMany() 方法用於更新集合中符合條件的所有文檔。

語法:
```javascript
db.collection.updateMany(filter, update, options)
```

示例:
```javascript
db.orders.updateMany(
  { "orderInfo.status": "pending" },
  { 
    $set: { "orderInfo.status": "processing" }
  }
)
```
這個操作會將所有狀態為 "pending" 的訂單更新為 "processing",並添加最後修改日期。

4. deleteOne

deleteOne() 方法用於刪除集合中符合條件的第一個文檔。

語法:
```javascript
db.collection.deleteOne(filter, options)
```

示例:
```javascript
db.orders.deleteOne({ "orderInfo.orderNumber": "ORD003" })
```
這個操作會刪除訂單號為 "ORD003" 的訂單。

5. deleteMany

deleteMany() 方法用於刪除集合中符合條件的所有文檔。

語法:
```javascript
db.collection.deleteMany(filter, options)
```

示例:
```javascript
db.orders.deleteMany({ 
  "orderInfo.status": "cancelled",
  "orderInfo.orderDate": { $lt: new Date(new Date().setDate(new Date().getDate() - 30)) }
})
```
這個操作會刪除所有狀態為 "cancelled" 且訂單日期超過 30 天的訂單。

注意事項:

1. 對於更新操作,使用 $set 運算符來設置字段值,使用 $inc 來增加數值字段,使用 $currentDate 來更新日期字段。
2. findAndModify() 方法在 MongoDB 3.2 版本後被 findOneAndUpdate(), findOneAndReplace(), 和 findOneAndDelete() 取代,但在許多驅動程序中仍然可用。
3. 執行這些操作時要小心,特別是 deleteMany(),因為它們可能會影響大量數據。
4. 在生產環境中,建議在執行這些操作之前先測試查詢條件,以確保它們符合預期。

如果您需要更多關於這些操作的細節或有任何特定的使用場景,請隨時告訴我。

::: 


#### updateOne and findOne v.s. findAndModify

- another user could have updated the document between the two queries and returned incorrect results.

