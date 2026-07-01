// ─── 作品系列数据 ──────────────────────────────────────────────

export interface WorkImage {
  src: string;
  title: string;
  positivePrompt: string;
  negativePrompt: string;
}

export interface WorkSeries {
  slug: string;
  title: string;
  tag: string;
  coverImg: string;
  description: string;
  images: WorkImage[];
}

// ─── 按品类定制的负向提示词 ────────────────────────────────────
// 人像（水下 / 素颜 / 情绪 / 电影感）
const NEG_PORTRAIT = '最差质量，低质量，普通质量，模糊，失焦，噪点，颗粒粗糙，过度锐化，塑料感皮肤，蜡像质感，油腻反光，磨皮过度，面部畸形，五官不对称，歪脸，斜眼，眼神呆滞，瞳孔畸变，多余手指，缺指，畸形手部，肢体扭曲，比例失调，脖颈过长，牙齿畸形，皮肤色斑不自然，浓妆廉价感，强烈AI感，3D渲染塑料感，卡通，插画风，文字，水印，签名，logo，边框，过曝死白，欠曝死黑，色彩溢出，重影';
// 美食（甜品 / 正餐 / 饮品）
const NEG_FOOD = '最差质量，低质量，模糊，失焦，噪点，塑料感食物，假模型质感，硅胶质感，油腻反光过度，颜色发灰暗淡，食物变质，发霉，干瘪，苍蝇异物，畸形餐具，摆盘杂乱，汤汁浑浊，酱料结块，色彩失真，过曝死白，欠曝发黑，AI塑料感，卡通，插画风，手指入镜，脏污背景，文字，水印，签名，logo，边框';
// 香氛产品 / 静物
const NEG_PRODUCT = '最差质量，低质量，模糊，失焦，噪点，塑料廉价感，瓶身畸形，瓶盖歪斜，标签错乱，文字乱码，反光过曝，指纹污渍，划痕，气泡瑕疵，色彩浑浊，背景杂乱，构图失衡，比例失调，多余物体，AI感，劣质渲染，卡通，水印，签名，logo，边框，过曝，欠曝';
// 3D 数字艺术
const NEG_3D = '最差质量，低质量，模糊，噪点，多边形穿模，破面，模型破洞，锯齿边缘，贴图错误，法线错误，UV拉伸，塑料廉价感，渲染噪点，色彩断层，构图失衡，比例失调，透视错误，2D平面感，脏污，卡通，水印，文字，签名，logo，边框，过曝，欠曝';
// 场景 / 建筑 / 海滨
const NEG_SCENE = '最差质量，低质量，模糊，失焦，噪点，畸变，透视错误，建筑变形，墙体倾斜，线条扭曲，天空死白，云层脏乱，色彩浑浊，杂乱电线，多余人物，路面污渍，比例失调，AI感，劣质渲染，卡通，插画风，水印，文字，签名，logo，边框，鬼影，重影，过曝，欠曝';
// 自然果物 / 微距
const NEG_NATURE = '最差质量，低质量，模糊，失焦，噪点，色彩失真，果实腐烂，虫蛀，霉斑病害，干瘪褶皱，塑料假果质感，蜡质假感，背景杂乱，构图失衡，过曝死白，欠曝发黑，色彩溢出，AI塑料感，卡通，插画风，水印，文字，签名，logo，边框，多余物体，比例失调';
// 野生动物 / 宠物
const NEG_WILDLIFE = '最差质量，低质量，模糊，失焦，噪点，动物畸形，多余肢体，缺腿，眼神呆滞，瞳孔畸变，毛发杂乱结块，比例失调，解剖结构错误，多头，融合怪，塑料感，标本僵硬感，背景杂乱，过曝死白，欠曝发黑，AI感，卡通，插画风，水印，文字，签名，logo，边框，重影';
// 油画 / 绘画风
const NEG_PAINTING = '最差质量，低质量，笔触脏乱，色彩浑浊发灰，画面平板呆滞，构图失衡，比例失调，面部畸形，五官错位，多余肢体，手部畸形，颜料堆积生硬，照片写实感（与油画风冲突），数码平滑感，噪点，脏污，水印，文字，签名，logo，边框，AI感，过曝，欠曝';
// 通用兜底（逐系列替换为分类负向词的过程中保证编译）
const NEG = NEG_PRODUCT;

export const workSeries: WorkSeries[] = [
  // ── 首页系列 ─────────────────────────────────────────────────
  {
    slug: 'tiffany',
    title: '蒂芙尼蓝的盛夏',
    tag: 'Scene',
    coverImg: '/images/work-1.jpg',
    description: '蒂芙尼蓝与盛夏海风，那家转角便利店是夏日的锚点',
    images: [
      { src: '/images/tiffany/0357e4bea72162acfeae85a387e0f376.jpg', title: '柠檬巷深处', positivePrompt: '意大利南部阿马尔菲海岸古老石板街巷向纵深延伸，一道厚重拱形石门洞掩映在枝繁叶茂的柠檬树下，金黄饱满的柠檬垂挂枝头触手可及；街边错落摆放赤陶花盆与盛放的黄色野花，斑驳石灰墙上悬挂复古锻铁灯笼，翠绿木质百叶窗点缀暖黄立面之间；正午阳光穿透叶隙洒下斑驳跳动光斑，暖金色调饱和通透，弥漫地中海慵懒午后气息；超高清写实摄影，35mm定焦，浅景深，自然光，层次丰富，8K细节', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/229b5fc8942d064dc7da12ea336358f7.jpg', title: '爱琴海晨曦', positivePrompt: '希腊爱琴海沿岸小镇黄昏景致，白墙蓝顶建筑沿蜿蜒海湾层叠排列，金色沙滩缓缓延伸至平静如镜的海面；前景一丛盛放的粉红色三角梅簇拥着斑驳木制路牌，橄榄树纤细枝条自画面上方垂落形成天然画框；暖橙色晚霞将天空与海面浸染成玫瑰金色调，光线柔和浪漫，色温温暖；风光摄影，广角构图，逆光层次，高动态范围，唯美通透，8K超清', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/486d103927daa4963d6f761fe0be7747.jpg', title: '白墙帆影间', positivePrompt: '地中海沿岸村庄鹅卵石坡道蜿蜒向海延伸，两侧洁白石灰墙上攀爬着艳丽玫红色九重葛繁花如瀑；深宝蓝色海面上静静点缀两艘白色帆船，屋顶铺设橙红色陶瓦在阳光下泛光，翠绿藤蔓自墙缝间探出；明媚阳光直射营造强烈明暗对比，天空湛蓝通透纯净，色彩清爽鲜明；旅行风光摄影，纵深透视构图，自然硬光，质感锐利，8K高清', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/5e665e836a9f6ace6fd6588c5fe12332.jpg', title: '蓝门向海开', positivePrompt: '希腊小岛洁白民居夹道形成的狭长巷道，尽头豁然敞开是无垠湛蓝爱琴海；蔚蓝色木门与窗框点缀在洁白粗粝的石灰墙上，墙面悬挂红色与粉色盆花，远处海中隐现小岛柔和轮廓；正午阳光直射墙面形成强烈明暗对比与硬朗投影，蓝白主色清爽明亮，色彩饱和通透；建筑风光摄影，对称纵深构图，自然强光，极简质感，锐利高清，8K细节', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/684880e14c509cca4b34271525d7e060.jpg', title: '海岸公路尽头', positivePrompt: '中国东南沿海小镇一条笔直公路径直向海延伸没入海天交界，两侧矗立红黄蓝相间的彩色民居楼房错落有致；远处碧蓝大海中零星岩礁耸立，天空布满蓬松洁白的积云，海水明亮通透呈蒂芙尼蓝；公路中央黄色虚线强力引导视线直抵尽头，正午顶光明亮，色彩鲜艳饱和，画面通透干净；风光摄影，一点透视构图，广角，自然光，清新明快，8K超清', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/706c63f0835da5688bebfd0a8549e264.jpg', title: '海边便利店', positivePrompt: '一栋两层蒂芙尼蓝色小建筑静静伫立海边街道转角，门前摆放红色自动贩卖机与丛丛绿植盆栽，两棵高挑椰子树分立两侧随风轻摇；背景堆积如山、蓬松壮观的巨型积雨云与深邃蓝天，远处可见一线碧蓝海面；暖阳斜照，色彩清新明快，蓝白对比强烈；浓郁日系治愈插画风格，中远景构图，柔和光影，通透明亮，细腻质感，高清8K', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/8ace1c6542fc222757ed2f4e439ba64e.jpg', title: '柠黄小筑', positivePrompt: '一栋洁白现代两层小楼，鲜亮柠檬黄色拱形大门与窗框点亮整体立面，门口精致绿植错落摆放；二楼露台撑起草绿色遮阳伞，一旁橙色果树繁花满枝，石板地面呈不规则拼花图案；柔和日光均匀铺洒，黄白主色清新简约，兼具地中海风情，色彩明快干净；超精细写实3D渲染，正面平视构图，柔和环境光，材质细腻，边缘锐利，8K超高清', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/9f786df8ff4f3552bae9b369bc53c0c3.jpg', title: '海堤暮色长', positivePrompt: '欧洲滨海小城砖石人行步道悠然延伸向远方，左侧洁白古典建筑外墙攀爬着茂密常青藤，路旁复古木质长椅前摆放红花盆栽；铸铁路灯在渐深暮色中次第亮起暖光，右侧锻铁栏杆外波涛轻拍嶙峋礁石；压境乌云间透出温暖金色余晖，色调暖橙深沉，光影戏剧；胶片风光摄影，纵深引导线构图，黄金时刻逆光，颗粒质感，氛围浓郁，8K', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/ad29ed1f874bb7e540da5f7e409bf107.jpg', title: '珊瑚咖啡屋', positivePrompt: '一栋欧式风情珊瑚粉色两层转角咖啡馆，外墙爬满浓密翠绿藤蔓，红白条纹遮阳篷下木质窗格散发复古气息；翠绿色拱形木门与锻铁灯笼相映成趣，门口摆放花盆与手写黑板菜单；暖阳柔和斜照，珊瑚粉与墨绿撞色梦幻温暖，色调浪漫治愈；超精细写实渲染，街角斜角构图，柔和暖光，材质细腻真实，浅景深，氛围唯美，8K超清', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/d9b4981a0ac9a7552940752264795d78.jpg', title: '猫与紫花石阶', positivePrompt: '希腊小岛石板小径蜿蜒向下通往碧蓝海湾，石砌矮墙上错落摆放各色赤陶花盆；道路右侧一棵盛放紫红色九重葛华盖如伞繁花垂落，小径上两只慵懒花猫信步闲坐凝望；远处可见小码头与系泊的彩色渔船，正午阳光通透，色彩鲜明饱和，蓝紫撞色明快；旅行纪实摄影，俯视纵深构图，自然光，生活气息浓郁，锐利清晰，8K高清', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/db4c45402d32b61452b1074eee342a36.jpg', title: '蓝车与柠檬海', positivePrompt: '意大利阿马尔菲海岸观景台，一辆复古蒂芙尼蓝色Vespa踏板摩托车斜靠石砌矮墙旁，车篮中摆满新鲜金黄柠檬；旁侧柠檬树枝垂落饱满果实，背景是层次分明的蔚蓝地中海与崖壁上层叠错落的彩色建筑群；午后阳光充足柔和，暖调通透，蓝黄撞色清新复古；旅行生活方式摄影，中景浅景深，自然侧光，质感细腻，色彩饱满，8K超清', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/ddc692bad473169170024073c07f5e69.jpg', title: '海风咖啡露台', positivePrompt: '地中海风情滨海露台餐厅，鲜艳柠檬黄色外墙搭配湛蓝拱门，藤编桌椅临海而设静候海风；空中悬挂装饰指路牌指向远方，背景是无边蔚蓝海面与点点白帆；盛放的粉红色花卉自建筑边缘恣意溢出，午后强烈阳光将整个场景浸染成温暖金色调，色彩明快撞色；旅行风光摄影，开阔中景构图，自然逆光，通透唯美，细腻质感，8K', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/f98dbb665eff607833b4fd9246da5088.jpg', title: '柠檬树下对饮', positivePrompt: '克罗地亚风情石砌露台，两把质朴木椅围坐于小圆桌旁，桌上摆放盛满柠檬水的玻璃杯与新鲜黄柠檬；头顶一棵满载金黄果实的柠檬树撑起天然凉荫，蓝色木质百叶窗点缀洁白粗粝石墙；背景两艘白色帆船静泊于深邃蓝色海面，正午柔光通透，暖黄与湛蓝清爽撞色，画面静谧惬意；生活方式摄影，中景浅景深，自然光，质感细腻，8K超清', negativePrompt: NEG_SCENE },
      { src: '/images/tiffany/fdf73bc3374cee2447994020effa3eb5.jpg', title: '云涌海边小铺', positivePrompt: '日系风格海边街角小商店，蓝色与粉色混搭的两层建筑温柔可爱，门前摆满层叠绿植与露天木质桌椅；天空被巨型蓬松积雨云团壮阔占据，远处可见一线碧蓝大海，椰子树在海风中轻轻摇曳；柔和暖阳斜照，色彩清新治愈，蓝粉白通透明亮；强烈日本治愈系插画质感，中远景构图，柔光氛围，细腻通透，唯美宁静，高清8K', negativePrompt: NEG_SCENE },
    ],
  },
  {
    slug: 'rose',
    title: '香氛里的玫瑰梦境',
    tag: 'Product',
    coverImg: '/images/work-2.jpg',
    description: '奢华香氛的视觉叙事，玫瑰与光在梦境中的相遇',
    images: [
      { src: '/images/rose/0684c1932e7a95a96d875bf4948dd6c8.jpg', title: '蝶恋花田香', positivePrompt: '一只粉色透明玻璃香水瓶静置花田中央，圆润瓶身折射出温柔粉金光晕，磨砂瓶盖上停落一只翅膀半透明的白蝴蝶；周围盛放大量粉白奶油色玫瑰与雏菊，另有三只蝴蝶在空中翩然飞舞，背景是朦胧柔焦的花海草地与粉蓝天空；光线自背后穿透营造梦幻逆光与光斑，色调柔粉浪漫，玻璃质感通透；高端香氛产品摄影，微距浅景深，柔光逆光，8K超清细节', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/09002725c20ea780a3b79ed53570c8bf.jpg', title: '暮色烈焰瓶', positivePrompt: '一只深酒红色球形玻璃香水瓶，瓶身覆盖精美金色巴洛克浮雕卷草花纹，顶盖为金色火焰造型装饰，庄重伫立海边嶙峋礁石之上；背景是紫红色壮丽落日晚霞映照在波涛汹涌的海面，远处悬崖边一位身着深红飘逸长裙的女性剪影静立；暖金逆光勾勒瓶身轮廓，色调深红鎏金奢华，玻璃与金属质感厚重；高端香水广告摄影，中景浅景深，戏剧光影，8K', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/2466eeb64b37599200059a3c3e10d52b.jpg', title: '玫瑰烟雾殿堂', positivePrompt: '一只粉玫瑰金色多切面玻璃香水瓶巍然立于发光的水晶矿石底座上，四周弥漫飘渺白色薄雾与飞散的粉色玫瑰花瓣、白色小花；背景是金色吊灯与暗金色奢华室内装饰，烛光般的暖光自四面轻柔环绕照射，金粉微尘在空气中悬浮闪烁；色调暖金玫粉，材质晶莹奢华，光影朦胧梦幻；顶级香氛静物摄影，中景浅景深，柔和体积光，细腻质感，8K超清', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/4daee803e0512703428e69104d8008b2.jpg', title: '椰香热带之瓶', positivePrompt: '一只金色琥珀色圆润香水瓶嵌入半剖开的椰子壳中，瓶身附着晶莹水滴，周围散落洁白鸡蛋花与透亮冰块水珠；背景是东南亚热带海岛风光，碧绿棕榈叶、金色沙滩与纯净蓝绿色海水交相辉映；充沛阳光直射投下清晰投影，色调清爽热带，琥珀玻璃通透，材质水润清凉；清新香氛产品摄影，中近景浅景深，自然硬光，高饱和，8K细节', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/5bf564a9c9167db4b3168a2a87f7030e.jpg', title: '竹间一抹绿', positivePrompt: '一只小巧透明的绿色精华液瓶安静搁置于潮湿竹节之上，晶莹水珠沿竹身缓缓滑落，旁侧点缀几片翠绿细叶；背景是深绿色竹林在柔和侧光中的朦胧剪影，一束聚焦光柱精准打在产品上勾勒轮廓；色调沉稳清冽，绿意盎然，玻璃质感通透水润，充满东方禅意留白；高端护肤品静物摄影，微距浅景深，聚光侧逆光，宁静氛围，8K超清', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/653de173e65005b859004636f8185958.jpg', title: '苔藓柠香方瓶', positivePrompt: '一只透明方形玻璃香水瓶端庄置于苔藓覆盖的湿润岩石上，瓶内液体清透淡绿，周围摆放对半切开的黄柠檬与青柠露出多汁果肉；整体环境被翠绿苔藓层层包裹，光线穿透玻璃瓶身折射出晶莹剔透的质感；色调清新自然，绿黄相映鲜活，材质水润通透；清新香氛产品摄影，微距浅景深，柔和自然光，细腻纹理，高饱和，8K高清', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/6aa831eb3ac1113f285ad7f3cbdbf329.jpg', title: '荒野瀑流蓝瓶', positivePrompt: '一只深宝蓝色香水瓶被奔涌激流正面冲刷，水花四溅炸裂成动感弧线，瓶身沾满晶莹飞溅的水珠；背景是热带雨林深处茂密绿植与飞流直下的壮阔瀑布，阳光穿透弥漫水雾形成耀眼光斑；色调深蓝苍翠，充满力量感与速度感，玻璃质感冷冽，水花高速凝结；运动感香水广告摄影，中景，高速快门定格，戏剧逆光，锐利，8K超清', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/752ab5b36f10c7a3123be70a0776098a.jpg', title: '深夜星砂之蓝', positivePrompt: '一只深夜蓝色香水瓶半沉于黑色湿润细沙之中，瓶身覆有细密水珠，周围散布暗色礁石；背景深蓝黑色空间里微小粒子如星尘般静静漂浮闪烁，光源自画面前侧打出精准的蓝色冷光勾勒瓶身；色调幽深神秘，冷蓝主调，玻璃质感深邃通透，氛围静谧高级；高端男香广告摄影，中近景浅景深，低调冷光，颗粒星尘，锐利，8K细节', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/7b46c4a09f0336b3454dc1b8639e11ea.jpg', title: '沉木烟火琥珀', positivePrompt: '一只琥珀色透明泵头沐浴瓶横卧于苍老沉木之间，细腻白色烟雾自木缝间袅袅升腾弥漫；木质纹理粗犷厚重呈深棕色，产品标签在昏黄光线下散发温暖金色微光；色调暖棕琥珀，材质温润通透，木纹质感沧桑，充满东方沉香与乌木气息；高端个护产品摄影，中近景浅景深，低调暖光，烟雾氛围，细腻质感，8K超清', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/95f38cf67ef6ade4f63ba5bad9fece2c.jpg', title: '暗夜焰火黑瓶', positivePrompt: '一只全黑磨砂玻璃香水瓶与一截燃烧着橙红火焰的干枯树根并置于深蓝湿润的镜面表面，周围散布晶莹水珠映出微光；金色品牌标志在纯黑瓶身上低调闪耀，火焰橙红与深蓝背景形成强烈冷暖色温对比；色调暗黑鎏金，材质磨砂哑光与火光跳动，氛围神秘炽烈；高端男香广告摄影，中景浅景深，戏剧火光，冷暖对撞，锐利，8K', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/d079644fc128f72e344e6df3957f6e10.jpg', title: '荒原日落传说', positivePrompt: '一只深色磨砂玻璃香水瓶沉稳置于荒野礁石之上，背景是燃烧般的火红、橙、紫渐变落日天空，广阔荒野地平线延伸至无限远处；强烈暖光自背后打出清晰轮廓光勾勒瓶身，色调火橙深紫史诗磅礴；材质磨砂哑光厚重，光影强烈戏剧，充满力量与传奇感；高端香水广告摄影，中景低角度，黄金时刻逆光，大气氛围，锐利，8K超清', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/d2879c07526b65e895db2c83a7933e90.jpg', title: '松林雾中洁净', positivePrompt: '一支绿白渐变色洁面产品软管竖立于青石板上，旁边倚靠一块粗砺小石，右侧松枝自画面边缘探入；背景弥漫薄薄青绿色烟雾，侧逆光在管身勾勒出柔和高光边缘；色调清新沉稳，绿白主调充满自然植物感，材质哑光细腻，氛围清冽洁净；护肤品静物广告摄影，中近景浅景深，柔和侧逆光，薄雾氛围，细腻质感，8K高清', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/d28ebf1774ace80a82b7486eca6fc48c.jpg', title: '苔石香奈儿', positivePrompt: '一只经典方形透明玻璃香水瓶静置于森林苔藓覆盖的岩石上，瓶内金棕色液体在斑驳林间光线下折射出温暖光芒；四周环绕翠绿蕨类植物与点点紫色小野花，背景是光线穿透树冠洒落的梦幻光柱；色调暖金苍翠，玻璃质感晶莹，苔藓蕨叶湿润细腻，氛围静谧梦幻；高端香氛产品摄影，微距浅景深，穿透体积光，细腻纹理，8K超清', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/ec3274f990e7d113ef9a982ddb87ad91.jpg', title: '野花丛中方瓶', positivePrompt: '一只带粉棕色皮革标签的方形玻璃香水瓶矗立于色彩斑斓的野花草地之上，周围盛放粉色、蓝色雏菊与各色小野花；整体沉浸在暖粉紫色的雾感光晕中，朦胧梦幻的焦外虚化令花田延伸感十足；色调暖粉柔紫，玻璃与皮革质感细腻，光线柔和逆透，氛围浪漫治愈；高端香氛产品摄影，微距大光圈浅景深，柔光逆光，唯美，8K高清', negativePrompt: NEG_PRODUCT },
      { src: '/images/rose/f1a6fb3bf5cf986159705e863416f2a7.jpg', title: '玫红瀑流之境', positivePrompt: '一只玫瑰红色多切面玻璃香水瓶被瀑布水流正面冲击，水花在瓶盖处炸裂飞溅，晶莹水珠在空中高速定格；四周漂浮着粉色睡莲花朵，背景是紫红暗色调的粼粼水波纹；色调浓烈玫红，动感十足，玻璃切面折射绚烂，水花凝结晶莹；高端女香广告摄影，中景，高速快门定格，戏剧光影，色彩浓郁饱和，锐利，8K超清', negativePrompt: NEG_PRODUCT },
    ],
  },
  {
    slug: 'forest',
    title: '林间鲜意',
    tag: 'Design',
    coverImg: '/images/work-3.jpg',
    description: '从山野到餐桌，以设计语言呈现自然的原始鲜活',
    images: [],
  },
  {
    slug: 'crystal',
    title: '晶屿橙花',
    tag: '3D Art',
    coverImg: '/images/work-4.jpg',
    description: '浮空的石岛上，水晶与橙花共生，静谧而超然',
    images: [
      { src: '/images/crystal/d28537a6c258a5d1c25c1f8a370f38df.jpg', title: '橙花晶屿浮', positivePrompt: '极致精细的3D艺术渲染，中性灰色纯净背景中一块悬浮的岩石碎块静静漂浮，岩石表面覆盖着湿润苔藓；上方生长出多根白色透明的石英晶柱与茂盛的橙色波斯菊，几片花瓣正飘散在空中；柔和漫射光均匀笼罩，投下自然真实的柔影，色调清新冷静，晶体通透折射，苔藓与花瓣质感细腻；超写实三维渲染，居中悬浮构图，柔光棚拍质感，微距细节，8K超高清', negativePrompt: NEG_3D },
      { src: '/images/crystal/79fba83c3f203fb2ecb6b6640b06b862.jpg', title: '枯木紫花岛', positivePrompt: '超精细3D渲染，浅灰白色极简背景中一块巨型沉木浮岛悬空漂浮，木纹纹理粗犷沧桑；岛顶生长着浓密翠绿苔藓与盛放的紫色花卉，周围深色矿石晶体碎片静静飘散，下方留有轻柔投影强化悬浮感；柔和漫射光笼罩，色调宁静清雅，木质、苔藓与晶体质感层次分明，超写实材质表现；三维数字艺术，居中悬浮构图，棚拍柔光，微距质感，8K超高清细节', negativePrompt: NEG_3D },
      { src: '/images/crystal/34da0c46c41f212d412e2573479c9dcd.jpg', title: '构成之漂浮', positivePrompt: '超高精度3D数字艺术，深灰色背景中一组构成主义风格的漂浮雕塑：枯木树干与金属球体、哑光月球体、透明玻璃球、白色有机形态雕塑及绿色苔藓植物共同组成复杂的悬浮结构；金属球反射温暖环境光，玻璃球折射通透，色调深沉神秘；工业冷硬材质与自然元素巧妙融合，质感对比强烈；超写实三维渲染，中心平衡构图，戏剧性布光，精密细节，8K超高清', negativePrompt: NEG_3D },
      { src: '/images/crystal/fb9129233a0b31ec4e81f52cb3d1ce4b.jpg', title: '红花碎石舞', positivePrompt: '超高清3D超现实主义艺术，暖灰色背景与高反光镜面地板上，灰色岩石群、红色草花与菊科干花、米白色有机枯叶形态凝固成爆炸般的悬浮构成；一支红花茎自中央石块插出向上伸展，暗色石块在空中散落漂浮，每一块碎裂物细节精致；柔和定向光塑造体积，色调温暖克制，材质粗粝与花瓣柔嫩对比；三维数字艺术，动态悬浮构图，镜面反射，微距细节，8K', negativePrompt: NEG_3D },
    ],
  },
  {
    slug: 'cherry',
    title: '丝绒上的红玛瑙',
    tag: 'Still Life',
    coverImg: '/images/work-5.jpg',
    description: '丝绒光影下的静物诗意，红与柔的极致碰撞',
    images: [],
  },

  // ── 人像系列 ─────────────────────────────────────────────────
  {
    slug: 'liuli',
    title: '琉璃之息',
    tag: 'Digital Art',
    coverImg: '/images/work-6.jpg',
    description: '沉浸于水下的绝美人像，琉璃般通透的光影世界',
    images: [
      { src: '/images/liuli/0241cf56f62024cc2955832ee1940d64.jpg', title: '水下凝息', positivePrompt: '水下人像特写，东方女性面孔沉浸于清透绿色水中，阳光从水面折射形成波纹光斑洒落脸庞，睁眼半闭神情宁静，周围漂浮绿叶与气泡，皮肤光泽水润，发丝随水流飘散，整体色调清透碧绿带金色光晕，超写实摄影风格，电影级光影，8K超高清，景深细腻', negativePrompt: NEG },
      { src: '/images/liuli/308857b8de9b203096942a9860ad253e.jpg', title: '深海仰望', positivePrompt: '水下仰拍人像，蓝眸少女侧脸浸于海水之中，仰视上方光源，水面光线形成绚烂折射纹路投射脸上，橙色花瓣与气泡在蓝色水体中漂浮，卷发飘散，肤色白皙温润，蓝色瞳孔清澈明亮，整体色调深蓝与暖橙对比强烈，奇幻唯美写实风格，电影级光影渲染，8K细节', negativePrompt: NEG },
      { src: '/images/liuli/3cbd11522f6e496d7daad90c02f97ac4.jpg', title: '雏菊漂梦', positivePrompt: '插画质感水下人像，少女面孔浸于浅蓝色水中，蓝灰眸子清澈灵动，白色雏菊花朵与水草环绕四周，细小水珠点缀脸颊，刘海湿润贴额，红唇微启，整体色调清冷蓝绿带粉白，具有二次元插画与超写实结合风格，光影柔和梦幻，细节极致，8K分辨率', negativePrompt: NEG },
      { src: '/images/liuli/3cfbf7feae86c42841ba1607dfb5d3c6.jpg', title: '蝶梦沉眠', positivePrompt: '奇幻水下人像特写，少女闭眸沉浸于深色水中，彩色荧光蝴蝶在四周飞舞漂浮，水面光线形成霓虹蓝紫色折射，皮肤呈现金属光泽质感，气泡晶莹剔透，整体色调以深蓝、霓虹紫、橘粉为主，超现实奇幻艺术风格', negativePrompt: NEG },
      { src: '/images/liuli/447aefd0f939d224dd36319cb75fb09b.jpg', title: '虹光倾城', positivePrompt: '超近距离女性面孔特写，绿色眸子摄人心魄，脸部覆盖绚烂彩虹折射光斑，橙黄金蓝交织的棱镜光线在皮肤上形成迷幻图案，湿润卷发凌乱飘散，皮肤质感极致真实带光泽，整体色调以暖金橙为主调辅以彩虹光泽', negativePrompt: NEG },
      { src: '/images/liuli/eb9bbdd1fffa3c9fe3e65154c79e7103.jpg', title: '泡影浮光', positivePrompt: '水下人像特写，棕发少女面孔浸于暗色水中，透明气泡大小不一漂浮四周并映出橙红色光斑倒影，水面折射形成白色波纹光影覆盖脸颊，眼神空灵略带迷离，皮肤质感细腻真实，红棕色发丝随水流散开', negativePrompt: NEG },
    ],
  },
  {
    slug: 'suyan',
    title: '素颜诗',
    tag: 'Portrait',
    coverImg: '/images/work-7.jpg',
    description: '素颜之下，诗意自生',
    images: [
      { src: '/images/suyan/036d5192f77c8c832b15607a1cce61e0.jpg', title: '风中回眸', positivePrompt: '东方女性户外人像，侧身回首凝视镜头，黑色长直发被微风吹散横过脸颊，穿格纹西装外套，皮肤细腻光泽自然无妆感，背景为模糊秋色绿植，整体色调温润清新，柔和自然光，胶片感摄影风格，散景背景，真实自然情绪', negativePrompt: NEG },
      { src: '/images/suyan/1d84af2c8af322de0959f8b6b5d21138.jpg', title: '泪眼无声', positivePrompt: '东方女性极近距离面部特写，微红眼眶泪光盈盈，蓝灰色眼珠湿润动人，额头刘海微乱，手指轻托下颌，皮肤自然真实可见细微瑕疵，整体色调冷白灰蓝，室内柔光自然散射，情绪细腻克制，真实感人的素颜人像摄影', negativePrompt: NEG },
      { src: '/images/suyan/349f0c34bb771daabf021c1981684904.jpg', title: '绿眸暗火', positivePrompt: '欧美女性面部特写，深邃绿色眼瞳极具穿透力，满脸雀斑自然真实，黑色长刘海遮半额，手指置于嘴唇旁，面部被一道暖橙光带斜切打亮，整体色调深暗底色与暖金光形成强烈反差，高端暗调人像摄影', negativePrompt: NEG },
      { src: '/images/suyan/4fb2ba828ccc708b6a493fa45abff17e.jpg', title: '清眸俯望', positivePrompt: '东方女性俯拍人像特写，女孩微微低头向上凝视，杏形棕色眸子明亮清澈，头发随意盘起碎发散落，穿深灰色毛衣，素颜自然肌肤光洁，整体色调中性灰白，室内柔和散射光，背景虚化朦胧', negativePrompt: NEG },
      { src: '/images/suyan/66.jpg', title: '雀斑碧眸', positivePrompt: '欧美风格女性面部超近距离特写，海蓝色眼眸清透迷人，满布雀斑的皮肤真实自然，黑色卷发蓬松飘散，粉色嘴唇微张，整体色调清冷白灰，柔和散射光，细节精细，梦幻气质', negativePrompt: NEG },
      { src: '/images/suyan/81e34898b519d5caf7e77803f72e4a69.jpg', title: '雨后凝神', positivePrompt: '东方女性超写实面部特写，细密水珠附着脸颊与额头，黑色刘海湿透贴面，棕色眸子深邃凝视略带忧郁，整体色调暗绿灰棕，低调戏剧性侧光打亮面孔一侧，皮肤纹理细腻真实，超写实CGI人像风格', negativePrompt: NEG },
      { src: '/images/suyan/89e89440f00945b658c53dcba30935fc.jpg', title: '素白无尘', positivePrompt: '东方女性棚拍人像，纯白背景极简构图，黑色长发自然散落，面朝正前方神情淡然，裸肩上身，皮肤自然健康可见细微雀斑与毛孔，整体色调纯白与肤色，棚拍均匀柔光，高端极简风格', negativePrompt: NEG },
      { src: '/images/suyan/b424c2f3514c6c3d315b0f7ca282f4db.jpg', title: '正面直视', positivePrompt: '欧美女性棚拍正面人像，对称构图，浓密剑眉配绿灰色眼眸，黑色短直发利落，极浅雀斑，裸肩，整体色调米白灰，柔和均匀棚光，高端时尚简约风格，超写实人像摄影', negativePrompt: NEG },
      { src: '/images/suyan/cfc6b3f12c97da87d43580760902b814.jpg', title: '湿发入镜', positivePrompt: '东方女性室内人像近景，半湿黑色短发自然散落，素颜肌肤略显粉红，眼神略带迷茫温柔，整体色调冷绿灰带暖肤色，自然散射室内光，极具生活质感的写实人像', negativePrompt: NEG },
      { src: '/images/suyan/d95452ab2c7e6eeefd3998dd801bb641.jpg', title: '暗夜玉颜', positivePrompt: '东方女性纯黑背景人像，半侧面构图，黑色长发消融于黑暗中，皮肤白皙如瓷细腻光洁，唇色淡粉微张，神情沉静内敛，整体色调极暗黑灰背景映衬白皙肤色，伦勃朗光效，高对比戏剧性人像摄影', negativePrompt: NEG },
    ],
  },
  {
    slug: 'nuanzong',
    title: '暖棕心事',
    tag: 'Mood',
    coverImg: '/images/work-8.jpg',
    description: '暖棕色调里的内心独白',
    images: [
      { src: '/images/nuanzong/00085c84e0ce1cc48c38a29450de22ce.jpg', title: '午后倾斜', positivePrompt: '欧美女性仰拍特写，躺卧姿态脸庞仰向阳光，眼睛微闭慵懒享受，饱满红棕唇色微张，雀斑散布，深棕卷发在头顶散开，整体色调暖棕金色阳光感十足，强烈自然侧光塑造鲜明轮廓，夏日慵懒情绪，超写实时尚摄影', negativePrompt: NEG },
      { src: '/images/nuanzong/29c422c30a90addaf97e58b9cf5fe74a.jpg', title: '逆光回首', positivePrompt: '东方女性户外逆光人像，短卷发在强烈阳光中形成金色光晕，面孔被暖光从侧后方包裹，黑色吊带，神情略带倔强专注，整体色调暖金棕橙，强逆光摄影技法，黄金时刻光效，超写实风格，电影感人像', negativePrompt: NEG },
      { src: '/images/nuanzong/32d6796af516d32be59f0ccbe3e879cd.jpg', title: '烛光低眸', positivePrompt: '东方女性室内极近距离特写，趴卧于桌面向镜头凝视，橙红烛光从侧下方打亮面孔，刘海齐平，眼神幽深神秘，背景为老旧报纸墙面，整体色调深暖棕橙低调氛围感十足，电影感布光', negativePrompt: NEG },
      { src: '/images/nuanzong/5339c540623787f9acbf6f5a4f74927b.jpg', title: '旧报墙前', positivePrompt: '东方女性复古室内人像，靠墙站立在贴满旧报纸的背景前，暗黄色吊灯从上方投射暖光，长直黑发垂落，身穿白色细肩带，神情微侧带淡淡忧郁，整体色调深棕暖黄复古感浓郁，港式复古胶片电影风格', negativePrompt: NEG },
      { src: '/images/nuanzong/a303ebcb3579910d8e4c081fb4fc808e.jpg', title: '风中闭目', positivePrompt: '欧美女性户外自然人像，头微仰闭眼享受阳光与微风，棕色卷发蓬松在风中飞扬，满布雀斑的皮肤在日落暖光下金光闪闪，整体色调暖棕金橙与天蓝形成温柔对比，黄金时刻自然光', negativePrompt: NEG },
      { src: '/images/nuanzong/c44f3057f666a2c38487d7a42088e23f.jpg', title: '秋叶车窗', positivePrompt: '东方女性公交车内人像，围棕橙色针织围巾，窗外光线从背后强烈透入形成逆光光晕，橙红枫叶在画面两侧装点，眼神仰视前方若有所思，整体色调暖橙棕秋日感强烈，逆光电影光效，焦糖色调', negativePrompt: NEG },
      { src: '/images/nuanzong/dce96f7eef83d8c532eb785df56d8fb8.jpg', title: '日落微笑', positivePrompt: '欧美女性户外人像，仰头微笑露出洁白牙齿，日落余晖从侧后方形成强烈金光，棕黑色长发在黄昏风中飘扬，满布雀斑，整体色调日落金橙棕与蓝灰天空对比，黄金时刻逆光摄影', negativePrompt: NEG },
      { src: '/images/nuanzong/f683355589ec49a214cce562b6330e58.jpg', title: '光晕仰思', positivePrompt: '东方女性室内逆光人像，仰头凝望斜上方，灰色围巾温柔包裹颈部，强烈暖黄光晕从右后方射入形成眩光，橙色枫叶装点左侧，神情游离思绪远处，整体色调暖棕金调散景光斑', negativePrompt: NEG },
      { src: '/images/nuanzong/fc8e8456e1d0a435bc8ba51868a4acc0.jpg', title: '草莓入唇', positivePrompt: '欧美女性床头特写，手持红色草莓轻触嘴唇，蓝绿眸子慵懒望向镜头，棕黑卷发凌乱散落额前，雀斑可见，整体色调以白色奶油底色与草莓红形成鲜明点缀对比，强烈自然顶光，诱人慵懒氛围', negativePrompt: NEG },
    ],
  },
  {
    slug: 'youhua',
    title: '油画里的夏日',
    tag: 'Painting',
    coverImg: '/images/work-9.jpg',
    description: '油画质感与夏日光影的交融',
    images: [
      { src: '/images/youhua/244a1116d07cf62092e94ccabc49c216.jpg', title: '沉梦映世界', positivePrompt: '油画风格人物肖像，一位深色短发少女侧卧沉睡，身着白色金绣华服，背景与衣物融合成色彩斑斓的世界地图轮廓，以赭石、群青、橙黄、奶白多色厚涂笔触构成，光线从左上方倾泻而下，形成柔和侧光，整体氛围静谧梦幻，色彩浓郁厚重，具有强烈古典油画质感', negativePrompt: NEG },
      { src: '/images/youhua/7cf648bdbfac642477ec73724766b052.jpg', title: '糖果泡泡梦', positivePrompt: '油画风格超现实人物，金发少女仰头闭眼，手持橙色水果片送入口中，头顶涌现出大量彩色糖果、橙瓣、浆果等缤纷果物汇聚成透明泡泡球形，天空为纯净蓝色，笔触粗犷豪放，夏日气息浓烈，充满甜蜜狂想的超现实油画美感', negativePrompt: NEG },
      { src: '/images/youhua/834420a2c0c97a9a05bf42be37947e38.jpg', title: '古寺裙裾飞', positivePrompt: '油画风格人物场景，金发少女身着粉白玫瑰花卉印花飘逸长裙，裙摆在风中大幅飞扬，背景为精雕细刻的东南亚风格白色佛塔庙宇阶梯，建筑装饰华美繁复，笔触厚重斑斓，色调以粉、红、白、金为主，充满异域旅途的浪漫油画气息', negativePrompt: NEG },
      { src: '/images/youhua/88c0a6a298c117ec3dd18778749da30e.jpg', title: '烈焰金箔颜', positivePrompt: '油画风格近景人物特写，蓝眼金发少女正脸凝视，面颊散布金箔碎片与红白条纹织物笔触交错覆盖，金色斑点点缀面部，笔触浓烈奔放，调色板刀肌理感强烈，色彩对比极为强烈，具有强表现主义油画风格', negativePrompt: NEG },
      { src: '/images/youhua/9397db605b78ed71fbeadcf00261688e.jpg', title: '瓢虫与蛋糕', positivePrompt: '油画风格童趣近景，卷发蓝眼女孩面部特写出现在画面上方，目光好奇地注视着一只鲜艳红色瓢虫停在草莓奶油蛋糕切片上，蛋糕奶油质感柔腻，草莓饱满鲜红，笔触厚重灵动，充满夏日午后慵懒甜蜜的油画氛围', negativePrompt: NEG },
      { src: '/images/youhua/95b4fc8dae70d0cde19a78b86f2e4549.jpg', title: '彩泡相拥时', positivePrompt: '油画风格人物与宠物，深发少女低头温柔抱着一只淡黄色巴哥犬，周身环绕着大量晶莹透明的彩色肥皂泡，背景以洋红、橙黄、紫罗兰等浓艳色彩大笔触平铺，整体色彩饱和度极高，充满夏日欢愉与无忧无虑的油画表现力', negativePrompt: NEG },
      { src: '/images/youhua/9a86c5186e3bd877b1a5713401c92341.jpg', title: '水晶球听音', positivePrompt: '油画风格超现实人物，肤色温暖的少女戴着金色镶宝石耳机头饰，侧身俯身凝神，轻轻靠近一个精致金座水晶球，球内关有一只起舞的小企鹅，整体氛围如梦似幻，金与蓝相互映衬，具有华丽梦境般的浓郁油画质感', negativePrompt: NEG },
      { src: '/images/youhua/9bce7fb52109c5d40ceddcb1a1bd24af.jpg', title: '蜂蜜入颜来', positivePrompt: '油画风格极近景人物特写，少女面部侧颊占据画面大半，一只硕大金黄蜜蜂停伫在蜂巢蜡质结构之上，金珠滴垂在耳侧，背景以蓝天色调铺陈，金橙、群青、桃粉色彩交织，光线明媚通透，呈现出夏日蜜意盎然的超现实油画诗境', negativePrompt: NEG },
      { src: '/images/youhua/9c33831ffd88657c4e0ae17c503c2a04.jpg', title: '黄野与斑马', positivePrompt: '油画风格人物与动物，深发少女身着彩色碎花宽袖长衫，盘腿侧坐，身旁是一匹以鲜明蓝白相间条纹描绘的斑马低首相伴，背景为饱和的纯黄色，整体笔触厚实浓郁，色彩对比强烈跳跃，充满夏日明艳张扬的油画生命力', negativePrompt: NEG },
      { src: '/images/youhua/9d7e89e330ec4d66a549d2ace8ed257a.jpg', title: '玫瑰斑马群', positivePrompt: '油画风格超现实人物场景，少女身着黑色金绣华服立于中央，仰首闭目，四周簇拥着多匹身披金色条纹的白斑马，背景由漫天粉红色花朵铺满，整体以粉、金、黑、白构成浓烈对比，厚涂笔触肌理丰富，营造出华美瑰丽的夏日油画奇境', negativePrompt: NEG },
      { src: '/images/youhua/9de7618bae5fe35bbaa8a204c4e7ff30.jpg', title: '粉殿裙影舞', positivePrompt: '油画风格人物场景，纤细女子背对观者，身着粉橙色印花飘逸长袍，裙裾被风扬起大幅展开，映射在光洁地面形成倒影，背景为金碧辉煌的东南亚白色神殿廊柱，色调以粉、橙、金、白为主，笔触流动婉转', negativePrompt: NEG },
      { src: '/images/youhua/a1aaa41814ff9bf26a853c8967fbc4d4.jpg', title: '巨果映仙城', positivePrompt: '油画风格超现实风景，画面中央耸立一颗巨大被咬过的红苹果，如山丘般宏伟，其身后隐现白色穹顶宫殿建筑群，粉色小鸟从苹果处四散飞起，身着橙红长裙的女子渺小立于平静水面，天空湛蓝，充满夏日奇幻的油画叙事感', negativePrompt: NEG },
      { src: '/images/youhua/a5ddf98725a0406aac4ae5e7acf4e76a.jpg', title: '花田问水镜', positivePrompt: '油画风格场景，金发少女身着白衬衫与砖红色长裙，俯身跪于繁花盛开的花圃之中，手指轻触一只圆形铜盘中的水面，水波荡漾映出天空与少女倒影，四周雏菊、橙花、紫花密密铺满，笔触灵动鲜活', negativePrompt: NEG },
      { src: '/images/youhua/aa1dc98198b4e429018f7f8e392c6c9f.jpg', title: '雏菊湿发颜', positivePrompt: '油画风格近景人物特写，深发少女正面凝视，发丝湿润散乱，交织着白色雏菊与橙色野花蔓延至四周，面部雀斑清晰，双唇微启呈橙粉色，光线柔和均匀，散发出夏日少女纯净自然的油画气息', negativePrompt: NEG },
      { src: '/images/youhua/b320d77d696028726f7336278359dce6.jpg', title: '金饰护心间', positivePrompt: '油画风格超现实人物，身着金绣白瓷华服的东方少女低首沉思，双手托起一颗透明心形玻璃容器，内藏跳动的人心与金枝花朵，背景漫铺粉色绣球花团，金饰耳环颈链华贵精美，充满古典宫廷与当代超现实交融的华美油画氛围', negativePrompt: NEG },
      { src: '/images/youhua/b360e98b3ec57e934d0ed4c4c94b5f70.jpg', title: '草莓虫儿语', positivePrompt: '油画风格超现实极近景，少女仰面面颊与颈部占据画面上方，画面下方铺满晶莹欲滴的草莓、奶油与红色浆果果冻，一只鲜艳红色瓢虫伫立其间，光线从侧方照射形成温暖通透的高光，整体以粉、红、奶白为主色', negativePrompt: NEG },
      { src: '/images/youhua/bb61b9a858e6cee6f4cdcd34135fe3b3.jpg', title: '繁花化人形', positivePrompt: '油画风格超现实人物，侧立的男性人形由千朵繁花与金色饰物构建而成，花朵为白、红、橙、粉各色，金箔碎片散布全身，背景是湛蓝天空与白云，整体如花束雕塑般宏伟，笔触厚重绚烂，色彩金碧辉煌与花朵烂漫交融', negativePrompt: NEG },
      { src: '/images/youhua/bf16bc99730d290ec8699a304a1b74d5.jpg', title: '噤声犬吻间', positivePrompt: '油画风格近景人物与动物，金发女子侧脸以金箔与玫瑰红厚涂描绘，右手食指轻竖于唇前作噤声姿态，一只淡黄色猎犬从左侧凑近嗅触她的指尖，背景以灰白为底，金红玫瑰色系在人物身上形成浓郁装饰感，笔触如调色板刀般奔放厚实', negativePrompt: NEG },
      { src: '/images/youhua/e7e28d9948b323d4e5a673aa3bd73e1b.jpg', title: '金苹果一口', positivePrompt: '油画风格人物特写，短发少女仰首张口，双唇轻触一颗被单手高举的纯金色苹果，少女身着金橙彩绘宽袖华服，色调以金黄、玫红、彩色点缀为主，背景为浅灰白，笔触粗豪奔放，金色颜料堆叠出强烈肌理', negativePrompt: NEG },
    ],
  },
  {
    slug: 'jiumeng',
    title: '旧梦',
    tag: 'Cinematic',
    coverImg: '/images/work-10.jpg',
    description: '电影感的旧日梦境',
    images: [
      { src: '/images/jiumeng/02aa408f3dbad1ae0ec817140976d74a.jpg', title: '风中回眸', positivePrompt: '黄昏逆光人像摄影，深色背景绿色丘陵，女子侧身回望，栗色长发被风吹散飘扬，金色夕阳侧逆光勾勒发丝轮廓，面部半明半暗呈现立体感，穿着米白色宽松衬衫，深邃眼神透出忧郁气质，胶片摄影质感，暗调大地色系', negativePrompt: NEG },
      { src: '/images/jiumeng/2fac851e876fbfe9782674e011caf2c1.jpg', title: '暮光车站', positivePrompt: '日系街头人像摄影，亚洲年轻女性特写，短发刘海，围着米色针织围巾，双手捧住围巾望向镜头，眼神清澈而略带忧愁，暖橘色侧光照亮面颊，背景虚化人群与街道车灯形成橙色光晕，整体色调温暖橙棕', negativePrompt: NEG },
      { src: '/images/jiumeng/3c52e4169f22f352d00706522f631b9f.jpg', title: '百叶窗晨光', positivePrompt: '室内人像特写摄影，亚洲女性面部，短卷发，仰头姿态，温暖金色阳光透过百叶窗投下条纹光影打在脸上，镜头光晕与散景光斑环绕，眼神迷离若有所思，嘴唇微张，整体色调金黄橙暖', negativePrompt: NEG },
      { src: '/images/jiumeng/4468ac007c058f47bb63b7249cdf1939.jpg', title: '街巷过客', positivePrompt: '欧洲街拍人像，金棕色长发在风中飞扬，女子侧身回头望向镜头，城市街道背景模糊虚化，金色侧光打亮发丝，整体运动模糊体现动感，棕褐色大衣，色调复古暖棕，胶片质感强烈', negativePrompt: NEG },
      { src: '/images/jiumeng/46206070346a20921dc8ec48f94108c5.jpg', title: '人潮孤光', positivePrompt: '城市街头人像摄影，欧洲女性半身像，棕红色长发随风披散，穿黑色上衣，直视镜头表情沉静略带疏离，背景虚化人群与城市光晕，金色逆光从后方洒落形成轮廓光', negativePrompt: NEG },
      { src: '/images/jiumeng/48d71822c4acd518824808e762769cc1.jpg', title: '列车上的少女', positivePrompt: '日系青春写真，亚洲少女在列车车厢内，穿黑色校服，手持老式DV摄像机仰望镜头，长发因风散落，俯角拍摄，窗外光线透入，面颊受光均匀清透，眼神纯真好奇', negativePrompt: NEG },
      { src: '/images/jiumeng/4f38ba28ea275abf4817646bc467a89a.jpg', title: '草野仰天', positivePrompt: '黄昏逆光风景人像，女子穿白裙站立于高草丛中，侧身仰头姿态，发丝随风飞扬，身形轮廓呈现暗色剪影，背景金黄与蓝天白云对比强烈，低角度仰拍视角，夕阳光晕弥漫整个画面', negativePrompt: NEG },
      { src: '/images/jiumeng/558c651a0e65440b5b08cf187cf61681.jpg', title: '窗边烛光', positivePrompt: '室内光影人像，亚洲女性侧脸特写，短发发髻，穿白色上衣，手持白色小花靠近唇边，强烈暖黄光源从侧方打亮花朵与面颊形成戏剧性明暗对比，整体背景蓝灰冷调与暖光形成冷暖反差', negativePrompt: NEG },
      { src: '/images/jiumeng/80db04cbd423ec62ff2447d433715abc.jpg', title: '寒风温柔', positivePrompt: '冬日户外人像摄影，亚洲女性仰头微闭眼神态，发丝在风中凌乱飞扬，配围巾与大衣，金色侧光打亮面部与发丝，暖橙色与背景深色树影形成对比，整体色调复古暖棕，胶片颗粒质感', negativePrompt: NEG },
      { src: '/images/jiumeng/8fc1b6f46f3c8910bb0e245e099c7d95.jpg', title: '阳光仰首', positivePrompt: '胶片人像摄影，女子侧脸仰望天空，栗色长发在光线中金色透明感，背景绿色树荫形成散景光斑，暖光强烈打亮面颊与发丝，微张嘴唇，眼睛轻闭，情绪自由恣意', negativePrompt: NEG },
      { src: '/images/jiumeng/9da5170979307b41b0dbc859f752796c.jpg', title: '烛火殿堂', positivePrompt: '欧洲古典风格人像摄影，女性特写，长卷发金棕色随风扬起，穿浅色亮片礼服，橙金色强侧光打亮面部形成戏剧性光影，背景古典建筑柱廊虚化，眼神深邃迷人，高贵神圣气质', negativePrompt: NEG },
      { src: '/images/jiumeng/a303ebcb3579910d8e4c081fb4fc808e.jpg', title: '闭眼感受阳光', positivePrompt: '黄金时刻户外人像，欧美女性特写，深棕卷发蓬松飞扬，雀斑清晰可见，双眼微闭嘴角上扬，仰头享受阳光，整体色调温暖金橙，天空背景浅蓝形成对比，逆光让发丝透光', negativePrompt: NEG },
      { src: '/images/jiumeng/ae19095dc4d7f1cd6ae121bcaf620c02.jpg', title: '散光晶莹', positivePrompt: '梦幻室内艺术人像，亚洲女性半身像，短黑发，穿透明水晶感薄纱上衣，阳光透过窗户形成无数水晶散光点洒落全身如繁星，面部光斑与彩色折射交织，神情若有所思仰望', negativePrompt: NEG },
      { src: '/images/jiumeng/e4b776609066f16ba8d116dd06046b90.jpg', title: '花树绿眸', positivePrompt: '明亮户外人像摄影，欧洲女性半身像，金棕波浪长发，绿色眼睛清澈，皮肤有雀斑自然美，白色花树与绿叶环绕形成自然花框构图，温暖金色侧光打亮面部与发丝', negativePrompt: NEG },
      { src: '/images/jiumeng/f2f20c2dd35983199121a332e504deb4.jpg', title: '霓光心事', positivePrompt: '室内暗调彩光人像摄影，欧美女性特写，短黑发卷曲蓬乱，穿白色细肩带，端坐于床上，双手抱膝望向镜头，表情忧郁迷离，背景冷蓝色调渲染整体氛围，面部暖橙光对比冷蓝环境', negativePrompt: NEG },
      { src: '/images/jiumeng/f3723fb1c43187b372249ec167c74de0.jpg', title: '光影低诉', positivePrompt: '暗调室内人像摄影，欧洲女性半侧脸，短黑发，穿黑色高领毛衣，一手托住下巴侧脸，柔和窗光从侧方照亮面颊，整体色调暗绿与暖黄，皮肤质感细腻，表情淡然中带着思绪', negativePrompt: NEG },
      { src: '/images/jiumeng/ff5f245f4595c6f28cb6db7ac53f2e6b.jpg', title: '草野夕光', positivePrompt: '黄金时刻户外人像摄影，亚洲女性特写，凌乱短发，穿条纹针织外套，背景逆光草地与阳光形成强烈光晕，发丝被光线打亮透明感，眼神直视镜头沉静有力，整体暖橙金色调', negativePrompt: NEG },
    ],
  },

  // ── 新增系列 ─────────────────────────────────────────────────
  {
    slug: 'bantang',
    title: '半糖时光',
    tag: 'Food',
    coverImg: '/images/bantang/dc82258fee44db922fd2999125a13820.jpg',
    description: '甜品与饮品的视觉盛宴，半糖半苦的美好时光',
    images: [
      { src: '/images/bantang/020b93e9b97639219279b12d9b3b4820.jpg', title: '焦糖巧克力山', positivePrompt: '一大块三角形咖啡花生酱冰淇淋派，顶部装饰着旋转奶油、焦糖淋酱、巧克力碎块与巧克力豆，内里夹杂密集的巧克力脆片，底层为酥脆饼干基底，放置于白色圆盘上，背景为大理石纹桌面，食欲感极强的商业甜品摄影', negativePrompt: NEG },
      { src: '/images/bantang/0402022cbc4a58004ccef6c000554def.jpg', title: '焦糖香蕉叠叠', positivePrompt: '华丽多层裸蛋糕，深棕色巧克力海绵蛋糕与奶白色奶油层交替叠放，侧面流淌金黄色焦糖酱，顶部装饰大量奶油花、香蕉片与整块奥利奥饼干，高端甜点店商业摄影风格', negativePrompt: NEG },
      { src: '/images/bantang/0402efb8dc69d69ce16841fc77244712.jpg', title: '蓝莓脆皮春卷', positivePrompt: '金黄酥脆的蓝莓奶酪春卷堆叠于深色陶盘中，切面露出饱满的新鲜蓝莓果粒与白色奶酪内馅，表面撒有糖粉，旁边散落新鲜蓝莓点缀，光线从侧上方自然照射使油炸质感酥脆感十足', negativePrompt: NEG },
      { src: '/images/bantang/083743d542b8ab8c01ac35ee709af553.jpg', title: '双杯奶昔盛宴', positivePrompt: '两杯丰盛的香蕉奶昔盛于高脚玻璃杯中，杯口堆积着大量厚实奶油花，撒有金色焦糖碎粒与巧克力碎，顶部插着新鲜香蕉切片，复古美式甜品店摄影风格', negativePrompt: NEG },
      { src: '/images/bantang/1e7739f4445100ea6d040b31afe5bd15.jpg', title: '草莓巧克力午后', positivePrompt: '一片三角形草莓巧克力慕斯蛋糕置于白色圆盘中，外层厚实可可粉外衣颜色深棕，内部夹有红润草莓切片，顶部放置一颗完整草莓，整体色调清新暖意，日系咖啡馆美食摄影风格', negativePrompt: NEG },
      { src: '/images/bantang/3a51b5f6891a4bc044b1c73ebe302bb4.jpg', title: '焦糖奶霜星冰', positivePrompt: '星巴克风格透明塑料大杯焦糖星冰乐，杯壁内侧流淌着旋转焦糖酱与奶泡纹路，顶部堆满鲜奶油配以焦糖淋面，插入白色细吸管，置于木质咖啡桌上，光线从侧面透过杯身照出琥珀色层次', negativePrompt: NEG },
      { src: '/images/bantang/5855d406095e73cd4ea9c2a6360394f2.jpg', title: '黑森林芝士塔', positivePrompt: '精致三角形黑森林芝士蛋糕截面，顶部铺满光泽樱桃与巧克力碎屑，中间白色奶油芝士层与深色巧克力层及暗红色黑樱桃果冻交替排列，底部为金棕色饼干碎基底，斜射自然光使截面层次极为分明', negativePrompt: NEG },
      { src: '/images/bantang/733969ce50985aba1cb6cc65b63c68d6.jpg', title: '草莓奶昔玫红', positivePrompt: '一杯高挑透明玻璃草莓奶昔，杯内草莓果泥与奶白色旋转交融形成大理石纹路，顶部堆满鲜奶油撒有玫红色草莓粉，上方摆放一颗完整草莓，插入红白条纹吸管', negativePrompt: NEG },
      { src: '/images/bantang/86365ca4a429f7fd994ddcfe9d9f41e2.jpg', title: '苔光梦幻饮料', positivePrompt: '渐变紫金色饮料易拉罐伫立于黛绿色苔藓地面，四周簇拥着雏菊小花与鲜嫩蔓藤，旁边摆放几颗白桃，背景是茂密深色丛林，一束神秘聚焦光柱从上方打在产品上形成光晕，薄雾在空气中飘散', negativePrompt: NEG },
      { src: '/images/bantang/8add91199fdecac9c8c3ee742003ed92.jpg', title: '金箔黑巧双杯', positivePrompt: '两杯奢华甜品饮料高举于大理石台面上方，左杯顶部为玫瑰奶油配樱桃与金箔片，右杯顶部托举整块熔岩巧克力蛋糕并淋有浓郁巧克力酱，暖黄灯光烘托高贵氛围', negativePrompt: NEG },
      { src: '/images/bantang/a7839ce49aeefd02476099bd9e540f8d.jpg', title: '汤汁晶亮小笼', positivePrompt: '橙色纸盒中整齐码放着十余只晶莹剔透的小笼包，每只顶部浇有红棕色辣酱与芝麻粒，点缀翠绿葱花，面皮薄透可见内馅汁水，充满中国街头美食的烟火气与鲜活质感', negativePrompt: NEG },
      { src: '/images/bantang/aeedabc515f31b2fa55db90dc78d8267.jpg', title: '芒果奶盖双杯', positivePrompt: '两杯装满金橙色芒果奶昔的透明塑料大杯并排而立，顶部覆盖厚实白色奶盖奶油，其上堆砌大量新鲜芒果丁，插入橙色吸管，白色奶油从杯壁缓缓渗下形成流淌纹路', negativePrompt: NEG },
      { src: '/images/bantang/dc82258fee44db922fd2999125a13820.jpg', title: '巧克力焦糖王者', positivePrompt: '整只圆形多层巧克力焦糖蛋糕，深棕色巧克力淋面从顶部缓缓垂落，侧面可见三层深色可可蛋糕与奶油黄色夹馅交替，顶部铺满玫瑰形奶油花、坚果碎与巧克力碎片', negativePrompt: NEG },
      { src: '/images/bantang/de094e5e4b071051f0d00984947bbbcc.jpg', title: '坚果奶油小圆饼', positivePrompt: '六只精致圆形夹心饼干整齐陈列于奶白色托盘中，饼体外壳裹满金棕色碎坚果，中间夹入丰盈的淡黄色玫瑰形奶油馅，简约高级法式甜品摄影风格', negativePrompt: NEG },
      { src: '/images/bantang/eb61dc427f7281d7a200cc8fea80094d.jpg', title: '伯爵茶瑞士卷', positivePrompt: '日式风格伯爵茶奶油瑞士卷蛋糕，茶色蛋糕胚卷裹洁白奶油内馅，切面螺旋纹路细腻，顶部装饰奶油花、饼干、迷迭香与巧克力珍珠，充满咖啡馆下午茶精致慢生活氛围', negativePrompt: NEG },
      { src: '/images/bantang/fdf94e917a7d2097ff82e6fb221899de.jpg', title: '熔岩巧克力心', positivePrompt: '精致圆形巧克力熔岩蛋糕置于白色盘中，表面撒有糖粉，顶部放一大球金黄色香草冰淇淋，巧克力酱从蛋糕一侧缓缓流淌，上方插着翠绿新鲜薄荷叶，高端餐厅甜品摄影质感', negativePrompt: NEG },
    ],
  },
  {
    slug: 'guose',
    title: '果色漫山野',
    tag: 'Nature',
    coverImg: '/images/guose/fad5d3794148fb6d285f68ca432ab234.jpg',
    description: '山野间的缤纷果色，自然馈赠的纯粹光影',
    images: [
      { src: '/images/guose/52c2582219592ab78803068eccfdb1b9.jpg', title: '紫李映绿荫', positivePrompt: '自然光下木板上新鲜紫红李子一簇，果皮深紫红带有蜡质光泽，粗壮果柄上挂着两颗果实，周围散落新鲜绿色叶片，背景绿叶虚化，近景微距摄影', negativePrompt: NEG },
      { src: '/images/guose/5430433c7e6afc11182270e8a167f0a2.jpg', title: '雨后梨挂枝', positivePrompt: '深色背景衬托下枝头悬挂两枚金黄色洋梨，果皮上布满晶莹剔透的水珠滴落，周围绿叶同样挂满露珠，光线从侧面打亮水滴，形成通透折射光效', negativePrompt: NEG },
      { src: '/images/guose/8c82501aec6bdb3a159649cb093af2cf.jpg', title: '墨蓝葡挂露', positivePrompt: '葡萄架上一串饱满深蓝黑色葡萄，果粒圆润饱满，表面布满晶莹水珠，周围绿叶遮掩，光线柔和通透，微距近景特写', negativePrompt: NEG },
      { src: '/images/guose/e0bb73218e9eb1a66675570069077817.jpg', title: '绸上双樱红', positivePrompt: '淡粉色丝绸布料上并排两颗深红色车厘子，果实饱满圆润光滑，连着同一枝细绿果柄，表面光泽莹润如珠，柔和漫射光线打亮', negativePrompt: NEG },
      { src: '/images/guose/e87a4fe57a1228a604c6fba0ef9c92fa.jpg', title: '蓝莓挂枝串', positivePrompt: '白色干净背景衬托下，蓝莓枝条上挂满饱满深蓝色蓝莓果实，布满细腻水珠，绿叶点缀其间，光线均匀柔和，果粒纹理清晰可见', negativePrompt: NEG },
      { src: '/images/guose/f09559072a3c9fd12ec8ffac6c75e3a0.jpg', title: '草莓垂红果', positivePrompt: '绿色叶片间垂挂的新鲜草莓，两颗鲜红饱满草莓果实悬挂枝头，表面颗粒细腻清晰，绿色果蒂鲜艳欲滴，背景绿色植物虚化成柔美光晕', negativePrompt: NEG },
      { src: '/images/guose/fad5d3794148fb6d285f68ca432ab234.jpg', title: '柠枝天空黄', positivePrompt: '蓝天白云背景下柠檬树枝上挂满三颗饱满金黄柠檬，绿叶茂盛衬托，天空渐变色从蓝到粉橙，自然光线明亮通透，仰视角度拍摄', negativePrompt: NEG },
    ],
  },
  {
    slug: 'yanhu',
    title: '烟火入诗',
    tag: 'Food',
    coverImg: '/images/yanhu/bce96b23654b620d543dd9164dec03f0.jpg',
    description: '烟火气息入诗意，日常美食的视觉升华',
    images: [
      { src: '/images/yanhu/4c508a98b43a9de520099eea1a402a5f.jpg', title: '铁锅金鸡香', positivePrompt: '铸铁锅中烤制的金黄鸡腿，表皮酥脆焦香，油脂在高温下渗出形成诱人光泽，搭配烤制蒜瓣与迷迭香香草，近景特写摄影，景深浅，背景木质桌面温暖虚化，专业美食摄影，自然光线', negativePrompt: NEG },
      { src: '/images/yanhu/55f00b93809a4589cf6ef0516a4364e2.jpg', title: '汉堡叠层情', positivePrompt: '经典美式汉堡，芝麻面包胚金黄饱满，厚实牛肉饼搭配融化切达芝士，新鲜番茄红艳欲滴，翠绿生菜卷曲舒展，腌黄瓜与紫洋葱层次分明，白色纯净背景，正面构图，专业产品级美食摄影', negativePrompt: NEG },
      { src: '/images/yanhu/5fb067006431a2453a0c6bc855e609e2.jpg', title: '烟雾绕面碗', positivePrompt: '日式拉面近景特写，深色陶碗中金黄浓汤面条，筷子挑起一缕面条，氤氲热气缭绕上升，碗中摆有半熟溏心蛋、红烧叉烧、海苔、青葱与红辣酱，背景橙色灯笼暖光虚化', negativePrompt: NEG },
      { src: '/images/yanhu/60866e1fb5be055eb810baca981c43ac.jpg', title: '热饼腾白雾', positivePrompt: '竹篮中叠放的烤饼，顶层洒有黄油融化后的金黄光泽，表面有烧烤焦斑分布均匀，热腾腾的白色蒸汽从饼面升起，灰色亚麻布衬底，深色木质背景，近景特写', negativePrompt: NEG },
      { src: '/images/yanhu/609d04d675614f7db974a1d0225fc41d.jpg', title: '金角炸三角', positivePrompt: '盘中整齐排列的金黄三角形炸薯角，外皮酥脆诱人，表面点缀碎香草，搭配新鲜香菜叶点缀，深色背景烘托金色主体，微距美食摄影，大光圈浅景深', negativePrompt: NEG },
      { src: '/images/yanhu/60df8eba42734f27e1c87069493c2a48.jpg', title: '炖肉凌空舞', positivePrompt: '黑色背景高速摄影创意美食，炖兔肉食材悬浮飞腾于空中，浓稠酱汁弧形飞溅，蘑菇、胡萝卜、珍珠洋葱、百里香散落其间，袅袅热气缭绕白色盘子，艺术感强烈的悬浮食物摄影', negativePrompt: NEG },
      { src: '/images/yanhu/62b53eea6a4867f88c3e9ac9a0b17f45.jpg', title: '芝士厚牛堡', positivePrompt: '白色背景展示的精品牛肉芝士汉堡，布里欧面包金棕色光泽，厚实烤牛肉饼焦香四溢，融化芝士金黄流淌，新鲜番茄片与绿叶蔬菜色泽鲜艳，完美的正侧面构图', negativePrompt: NEG },
      { src: '/images/yanhu/652379b24002ae95fab4355a2a326ec4.jpg', title: '山野菌篮秀', positivePrompt: '竹制篮子盛满山野菌菇，平菇、金针菇、松茸、鸡枞等多种菌类色泽丰富，背景是青山云雾缭绕的森林，融合文字设计的美食海报风格，传统与自然气息浓郁', negativePrompt: NEG },
      { src: '/images/yanhu/66ccd8d9331deab6b08ae2153f12eaa6.jpg', title: '番茄红烩肉', positivePrompt: '白色深盘中盛放的番茄红酒炖牛肉，大块酥烂牛肉色泽深褐，鲜红番茄汁浓郁丰盛，点缀新鲜香草碎绿色，旁有迷迭香装饰，木质桌面背景温暖质朴', negativePrompt: NEG },
      { src: '/images/yanhu/6a6f9d03f14b68e071ea56a95298d3fe.jpg', title: '寿司叠塔立', positivePrompt: '黑色背景悬浮创意摄影，多层寿司卷竖向叠放成塔，三文鱼、金枪鱼、鳄梨、鱼子酱等色彩鲜艳对比，芝麻与葱花点缀其间，高速摄影定格瞬间，艺术张力十足', negativePrompt: NEG },
      { src: '/images/yanhu/70a2f1bbbbf6a667a0bb806792c627e0.jpg', title: '煎饺红酱池', positivePrompt: '金黄色背景上三只煎饺散落排列，底部焦脆金黄，褶皱精致，周围漫延着鲜红辣椒酱，酱汁中有辣椒碎与香草点缀，食物艺术摆盘摄影，俯视构图', negativePrompt: NEG },
      { src: '/images/yanhu/81215fe394397f5f7a442164dc1ca60a.jpg', title: '战斧烤肉宴', positivePrompt: '插画风格美食场景，巨型战斧牛排切开后呈现粉红色内芯，骨柄长大气派，摆在木质切板上，周围搭配烤番茄、蒜头、迷迭香香草、多种酱汁小碗', negativePrompt: NEG },
      { src: '/images/yanhu/83139d7904d7695b6b7e520d306fe420.jpg', title: '蒸锅薯玉情', positivePrompt: '蒸锅白色大盘中摆放着金黄饱满的玉米棒和紫皮烤红薯，红薯自然开裂露出橙色内瓤，玉米粒饱满金黄光亮，整体色彩温暖朴实，家常食物质感真实', negativePrompt: NEG },
      { src: '/images/yanhu/853b1cfcb20b0850489b1b9cd7210fda.jpg', title: '虾丸汤宽碗', positivePrompt: '白色红边大碗盛满丰盛的东南亚风味汤面，碗中有云吞、虾、猪肉、鱼丸、绿叶蔬菜，清澈金黄汤底香气四溢，整体色彩鲜亮，美食摄影', negativePrompt: NEG },
      { src: '/images/yanhu/8fd053aeffdc7a1323b6dd43903f276d.jpg', title: '芝士番茄堡', positivePrompt: '白色纯净背景的经典芝士汉堡，布里欧面包金黄光泽饱满，厚实烤牛肉饼表面焦香纹理清晰，融化芝士金黄流淌，新鲜番茄片色泽红艳', negativePrompt: NEG },
      { src: '/images/yanhu/badca3ff06d198d9797d5d729aae3009.jpg', title: '辣汤面火锅', positivePrompt: '不锈钢大碗盛放的麻辣烫，浓郁红色辣汤底，筷子挑起一缕细面，碗中有溏心蛋、午餐肉、牛肉片、炸豆腐、粉丝、青菜等丰富配料，整体色彩热烈鲜艳', negativePrompt: NEG },
      { src: '/images/yanhu/bcac9b89b5680ed46d21bdffa249f7a9.jpg', title: '刺身繁花盘', positivePrompt: '深色岩石板上精心摆放的日式刺身拼盘，三文鱼、金枪鱼、白身鱼刺身色彩鲜艳，芝麻卷搭配血橙装饰，山葵绿意点缀，俯视角度拍摄，精致日料摄影风格', negativePrompt: NEG },
      { src: '/images/yanhu/bce96b23654b620d543dd9164dec03f0.jpg', title: '拉面爆破瞬', positivePrompt: '创意美食爆炸摄影，白色拉面碗悬浮空中，浓郁汤汁四溅成弧形，食材飞散：海苔、溏心蛋、葱花、辣椒碎、香料颗粒围绕飞舞，棕色温暖背景，精准高速摄影', negativePrompt: NEG },
      { src: '/images/yanhu/ca83c708d110d774f9d4067d373db02a.jpg', title: '蒜香草本饼', positivePrompt: '木质切板上并排摆放的烤蒜香芝士面包，表面金黄焦斑分布均匀，融化奶酪点缀其间，新鲜香草碎绿色点缀，背景模糊的香草植物', negativePrompt: NEG },
      { src: '/images/yanhu/da982cacd8faae8058bc78b4da9955c9.jpg', title: '翠蔬炒三色', positivePrompt: '白色大盘中盛放的中式清炒蔬菜，翠绿西兰花色泽鲜亮，鲜橙胡萝卜条色彩艳丽，棕色蘑菇片点缀其间，芝麻散落其上，光线明亮自然', negativePrompt: NEG },
      { src: '/images/yanhu/ddf786ecd00fcac2293ac9b3dbdef998.jpg', title: '酱烤牛肉片', positivePrompt: '白色深盘中堆叠的酱香牛肉片，肉色深褐泛光，洋葱丝金黄软糯，葱花碎点缀其上，整体色泽浓郁诱人，近景俯视特写', negativePrompt: NEG },
      { src: '/images/yanhu/f60c189fce9f5ce75a349e1452ad4ecf.jpg', title: '酥壳内馅露', positivePrompt: '白色盘中摆放的金黄炸肉馅饼，其中一个剖开露出碎牛肉馅料和青椒，外皮金黄酥脆，截面层次清晰，葱花点缀', negativePrompt: NEG },
    ],
  },
  {
    slug: 'shenglin',
    title: '生灵剪影',
    tag: 'Wildlife',
    coverImg: '/images/shenglin/0c6f4a6f224b844ef3857bd2758d83a3.jpg',
    description: '万物生灵的光影定格，自然与生命的深情凝视',
    images: [
      { src: '/images/shenglin/000b2ec5935e4d01f0f7778b3baf5d64.jpg', title: '蛇盘石上立', positivePrompt: '棕色沙岩石头上盘踞一条花纹蛇昂首挺立，身体背部深棕色，腹部奶黄色，鳞片纹理清晰，吐信姿态灵动，背景大地色系虚化，自然光线，近景特写，爬行动物微距摄影', negativePrompt: NEG },
      { src: '/images/shenglin/0c6f4a6f224b844ef3857bd2758d83a3.jpg', title: '夕阳双鹤舞', positivePrompt: '湿地夕阳背景下两只丹顶鹤并立，橙红圆日映衬天际，粉紫色渐变天空反射在水面，鹤颈修长优雅，红顶白羽对比分明，水中倒影波光粼粼，芦苇轻摇', negativePrompt: NEG },
      { src: '/images/shenglin/170e9c53e2b3974c5d157cb7a8284820.jpg', title: '猫狮豹同框', positivePrompt: '非洲草原日落时分，一只橘猫与雄狮和豹子并排站立自拍，背景斑马群悠闲吃草，天空橙金色光线，三只大小猫科动物神态各异，妙趣横生，写实风格动物摄影', negativePrompt: NEG },
      { src: '/images/shenglin/1fe0c27640ca87f5dce81b6f7ec0f4de.jpg', title: '三猫叠罗汉', positivePrompt: '灰色背景上三只不同毛色的猫咪上下叠放，从上到下分别是银灰猫、深灰猫、橘猫，绿眼、琥珀眼各具神态，表情庄重凝视镜头，毛发纹理细腻', negativePrompt: NEG },
      { src: '/images/shenglin/24a97b64876d78cc4f4b5b17c9635563.jpg', title: '虎猫共嬉戏', positivePrompt: '蓝天白云绿草地上，一只虎斑猫仰头大笑，颈挂金色铃铛，一只大老虎俯头贴近猫咪，神态亲昵，仿佛在自拍，背景草原开阔清新', negativePrompt: NEG },
      { src: '/images/shenglin/2d2b8991b88b8bf10d10a65d273f91c8.jpg', title: '绒羊微笑望', positivePrompt: '秋日草地背景中一只白色绵羊正面近景特写，厚实卷曲羊毛雪白蓬松，粉色耳朵轻竖，表情温柔似在微笑，眼神清澈，背景绿色草地与树木柔和虚化', negativePrompt: NEG },
      { src: '/images/shenglin/2e2e03d739288603f3ad9a8a8c31e8c2.jpg', title: '蜜蜂标本展', positivePrompt: '白色纯净背景上俯拍的蜜蜂标本摄影，蜜蜂背面展翅平铺，黄黑相间纹理清晰，翅膜半透明脉络精细，触角对称伸展，六条腿纤细分明', negativePrompt: NEG },
      { src: '/images/shenglin/2ff9d20bcb425b26ff968f9e5d0a3d33.jpg', title: '蜗牛攀青苔', positivePrompt: '雨后湿润树干上一只蜗牛缓缓攀爬，棕色螺旋壳纹路精细，背景绿色苔藓与虚化植物，浅景深，自然柔和光线，近景特写', negativePrompt: NEG },
      { src: '/images/shenglin/303769ea9e3fb4da4722431828e5d183.jpg', title: '瓢虫展翅飞', positivePrompt: '绿色叶片上七星瓢虫展翅欲飞，橙红色鞘翅张开，隐现透明内翅，黑色斑点对称分布，黄金时刻暖光从背后透射，营造光晕效果，微距摄影', negativePrompt: NEG },
      { src: '/images/shenglin/33061546a662525df38ede7f0c63a39b.jpg', title: '熊猫爬树枝', positivePrompt: '翠绿竹林背景中小熊猫幼崽抱树攀爬，黑白毛色对比鲜明，圆脸憨态可掬，眼神乌溜灵动，爪子抓握树干用力，背景竹叶绿意盎然柔和虚化', negativePrompt: NEG },
      { src: '/images/shenglin/344949b20b1536c806ba71df7102e0b1.jpg', title: '雄鹰傲枝立', positivePrompt: '绿叶背景中木桩上站立的白头海雕，白色头羽与棕色身体羽毛对比分明，黄色钩嘴锐利有神，黄爪紧握木桩，侧身微转神态威猛', negativePrompt: NEG },
      { src: '/images/shenglin/406e013bb92a507f2f4a85d07ac0acf9.jpg', title: '赤狐凝眸深', positivePrompt: '深色背景中红狐狸正面特写肖像，橙红色浓密毛发蓬松，黑色耳尖对称挺立，琥珀色眼睛深邃凝视镜头，白色下颌毛发与橙色毛色对比', negativePrompt: NEG },
      { src: '/images/shenglin/435076a149824eaf83e691e2b55ea53a.jpg', title: '浣熊凑近来', positivePrompt: '蓝天树林背景下浣熊张开双臂向镜头靠近，黑色眼罩花纹分明，灰棕毛色蓬松，黑色眼睛闪亮好奇，宽角镜头近距离拍摄', negativePrompt: NEG },
      { src: '/images/shenglin/5226bc6ac219074cfaad5fd939c9fcbe.jpg', title: '长颈鹿晴立', positivePrompt: '蓝天晴日背景下一只长颈鹿全身直立侧面展示，棕白色网状斑纹清晰，脖颈修长高挑，神态沉静优雅，背景蓝天与绿树清爽', negativePrompt: NEG },
      { src: '/images/shenglin/5647a4650aeda7816933d5887b31d82e.jpg', title: '竹林胖熊坐', positivePrompt: '翠绿竹林中大熊猫席地而坐，黑白毛色对比鲜明，圆胖憨厚体型，眼神若有所思望向远处，竹叶背景柔和虚化，地面苔藓青翠', negativePrompt: NEG },
      { src: '/images/shenglin/6c42bce19fbb4fe118dc68125a1f3a11.jpg', title: '水中犬探头', positivePrompt: '水下视角拍摄的边牧犬向镜头游来，张嘴露出舌头，水泡环绕，绿色水体透明通透，光线折射形成美丽光晕，宽角鱼眼效果', negativePrompt: NEG },
      { src: '/images/shenglin/72c795a59aa9f119dd3efe8f7b29d388.jpg', title: '水獭游蓝波', positivePrompt: '清澈蓝色水中水獭游向镜头，棕色皮毛湿润贴身，圆脸大眼睛可爱，胡须纤细，水面波纹与气泡环绕，色调清透蓝绿，高清水下摄影', negativePrompt: NEG },
      { src: '/images/shenglin/8d24888c3d4365114039b7c0f85deff4.jpg', title: '刺猬欢笑草', positivePrompt: '翠绿草地上一只刺猬仰头大笑，三爪张开欢快，棕色刺毛与柔软腹部毛发对比，嘴巴张开露出牙齿，神态憨趣可爱，背景绿草三叶草虚化', negativePrompt: NEG },
      { src: '/images/shenglin/8ddeb40ec51625aad859ee3c67870f82.jpg', title: '四犬低头圈', positivePrompt: '四只不同品种狗狗围成圆圈低头向下看，从下方仰拍视角，斑点狗、边境牧羊犬、拉布拉多猎犬等犬种伸着舌头，白色背景干净简洁', negativePrompt: NEG },
      { src: '/images/shenglin/93f6f0a9682db6f726243059f57f307e.jpg', title: '幼羊初立野', positivePrompt: '荒野背景中一只纯白幼羊直立正视镜头，卷曲细绒白毛蓬松可爱，粉色耳朵轻竖，双腿腕部黑色斑点对称，眼神清澈纯真', negativePrompt: NEG },
      { src: '/images/shenglin/947db7197a6e30459e763aecc6d1b605.jpg', title: '白犬仰天笑', positivePrompt: '蓝天绿树背景下白色萨摩耶仰头吐舌笑，蓬松雪白毛发光洁，棕黑色眼睛闪亮，宽角低视角仰拍，建筑与天空背景清晰', negativePrompt: NEG },
      { src: '/images/shenglin/991a05e8816767ce04debc030afa91ec.jpg', title: '狮猫暮色亲', positivePrompt: '非洲草原黄昏金色光线中，雄狮与虎斑猫面对面亲密依偎，狮子张嘴微笑，猫咪绿眼凝视，金色光晕环绕，背景非洲树木与橙色天空', negativePrompt: NEG },
      { src: '/images/shenglin/a765b9ec22b7533fdf9a0b02f1df0ace.jpg', title: '雨中母雀巢', positivePrompt: '细雨中苔藓枝头上小鸟叼着绿叶遮雨为雏鸟遮风挡雨，雏鸟巢中三只幼鸟蜷缩取暖，绿叶撑开如伞，背景野花草地柔和虚化', negativePrompt: NEG },
      { src: '/images/shenglin/ab8e80a87115aac937be63efa25b1299.jpg', title: '水豚溪边坐', positivePrompt: '清澈溪流石头旁一只水豚静静坐立凝视远方，棕黄色粗糙毛发，圆润敦实体型，背景秋色树木与溪流波光，黄金时刻温暖斜阳', negativePrompt: NEG },
      { src: '/images/shenglin/b623de1fd0df3f8d57de0cd853e21ff8.jpg', title: '小狗扑天际', positivePrompt: '蓝天白云中柯基犬从下方飞扑向镜头，张嘴大笑露出舌头，前爪伸展，耳朵飘扬，鱼眼宽角低仰拍，背景蓝天白云阳光明媚', negativePrompt: NEG },
      { src: '/images/shenglin/bbe26a897b027c8d6fd7e9b43c930a63.jpg', title: '母子鹿亲吻', positivePrompt: '非洲草原蓝天白云中长颈鹿母亲低头亲吻幼崽额头，母子情深，斑纹纹路清晰细腻，幼崽仰头依偎，背景高草与树木自然虚化', negativePrompt: NEG },
      { src: '/images/shenglin/c1b31a38c2ee70939f22c9a1766ccb9f.jpg', title: '棕熊倚树笑', positivePrompt: '森林深处大棕熊靠着粗壮树干仰头大笑，张嘴欢快表情，棕色厚实毛发质感粗犷，爪子搭在树干上，背景绿色森林虚化', negativePrompt: NEG },
      { src: '/images/shenglin/c8a1fa66c9a9c815fe3a3631159db027.jpg', title: '骏马奔花田', positivePrompt: '黄花草地上栗色骏马全力奔腾，鬃毛飘扬，肌肉线条优美，额头一点白色，背景绿树模糊，蓝天白云，自然光线侧打', negativePrompt: NEG },
      { src: '/images/shenglin/ccb228c721732919dbd31d98c07269ed.jpg', title: '柴犬浮水眠', positivePrompt: '清澈蓝绿色泳池水中柴犬仰躺漂浮，闭眼享受惬意，橙白色毛发湿润，周围水波荡漾形成光纹，从上方俯拍，水面折射光晕清透', negativePrompt: NEG },
      { src: '/images/shenglin/d6bdc4182b2a9889593ad77030b96c26.jpg', title: '花丛懒猫卧', positivePrompt: '黄昏金色光线下草坪白色雏菊花丛中一只虎斑猫侧卧，仰头以绿眼凝视镜头，白绿花朵在猫咪周围盛开，背景绿植与房屋柔和虚化', negativePrompt: NEG },
      { src: '/images/shenglin/dccfcc2a853ad076aa7af3aa930ef834.jpg', title: '变色龙绿枝', positivePrompt: '枝干上攀爬的鲜艳变色龙，蓝绿色条纹身体色彩斑斓，圆形转动眼睛棕红色，卷曲尾巴螺旋收紧，爪子紧握树干', negativePrompt: NEG },
      { src: '/images/shenglin/de756ba402d7be1f1e72c62100c38a72.jpg', title: '水獭坐石望', positivePrompt: '溪流苔藓石头上一只水獭端坐，棕色皮毛光亮，圆脸表情专注，黑眼睛机警，胡须伸展，背景溪流潺潺与绿叶秋色虚化', negativePrompt: NEG },
      { src: '/images/shenglin/e120f9b27b1c2b7ddf5796e7d6816198.jpg', title: '水豚晨光照', positivePrompt: '清晨金色光线中水豚站在水边苔藓石块上侧身仰望，棕黄色粗糙毛发，圆润体型，背景秋日树木与河流金光闪闪', negativePrompt: NEG },
      { src: '/images/shenglin/e4dfab22d5d27c7c302a1833e49195e7.jpg', title: '翠鸟破浪出', positivePrompt: '清澈水面上翠鸟跃出水面瞬间，蓝绿翅膀展开，水花四溅呈皇冠形，水珠晶莹飞散，背景水面与树木柔和虚化，高速摄影定格', negativePrompt: NEG },
      { src: '/images/shenglin/ef8eb12b3d4df9f3225db2e3ef3a8903.jpg', title: '鸮目凝远方', positivePrompt: '木栅栏上站立的猫头鹰正面肖像，棕红色与白色斑纹羽毛层次丰富，金黄色大圆眼睛犀利凝视，灰色弯钩喙，羽毛丰满蓬松', negativePrompt: NEG },
      { src: '/images/shenglin/fdf9ba20b7211cabd24cbb00600ac4fd.jpg', title: '雪绒犬奔跑', positivePrompt: '蓝天白云户外奔跑的白色比熊犬，蓬松雪白卷毛，圆脸黑色大眼睛，张嘴吐舌兴奋，低视角广角仰拍，前爪迈步', negativePrompt: NEG },
    ],
  },
];
