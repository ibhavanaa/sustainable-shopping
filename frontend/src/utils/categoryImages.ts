const DEFAULT_IMAGE = 'https://images.pexels.com/photos/264985/pexels-photo-264985.jpeg';

// Map common category names/keywords to representative images
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'bakeware': 'https://images.pexels.com/photos/4773654/pexels-photo-4773654.jpeg',
  'baking': 'https://images.pexels.com/photos/4051752/pexels-photo-4051752.jpeg',
  'kitchen': 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg',
  'smart speakers': 'https://images.pexels.com/photos/4790268/pexels-photo-4790268.jpeg',
  'speaker': 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
  'laptop': 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
  'monitors': 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg',
  'printer': 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg',
  'gardening': 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
  'guitar': 'https://images.pexels.com/photos/33597/guitar-classical-guitar-acoustic-guitar-electric-guitar.jpg',
  'ski goggles': 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
  'camera': 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg',
  'mobile phone': 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
  'industrial': 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg',
  'office': 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg',
  'make-up': 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
  'handmade': 'https://images.pexels.com/photos/264985/pexels-photo-264985.jpeg',
  'window treatments': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
  'bedding': 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
  'safety': 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
  'boys': 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
  // Exact category names from CSV (lowercased)
  'art & craft supplies': 'https://images.pexels.com/photos/7076760/pexels-photo-7076760.jpeg',
  'arts & crafts': 'https://images.pexels.com/photos/159644/art-school-creative-colourful-159644.jpeg',
  'baby & toddler toys': 'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg',
  'ballet & dancing footwear': 'https://images.pexels.com/photos/1405761/pexels-photo-1405761.jpeg',
  'bathroom furniture': 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
  'bathroom linen': 'https://images.pexels.com/photos/3965510/pexels-photo-3965510.jpeg',
  'bedding & linen': 'https://images.pexels.com/photos/545012/pexels-photo-545012.jpeg',
  'bedding accessories': 'https://images.pexels.com/photos/1438791/pexels-photo-1438791.jpeg',
  'bedding collections': 'https://images.pexels.com/photos/545012/pexels-photo-545012.jpeg',
  'bedroom furniture': 'https://images.pexels.com/photos/1454805/pexels-photo-1454805.jpeg',
  'boating footwear': 'https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg',
  'boxes & organisers': 'https://images.pexels.com/photos/4241792/pexels-photo-4241792.jpeg',
  'building & construction toys': 'https://images.pexels.com/photos/163114/lego-duplo-blocks-duplo-lego-163114.jpeg',
  "calendars & personal organisers": 'https://images.pexels.com/photos/2736499/pexels-photo-2736499.jpeg',
  "children's bedding": 'https://images.pexels.com/photos/1648374/pexels-photo-1648374.jpeg',
  'climbing footwear': 'https://images.pexels.com/photos/1290085/pexels-photo-1290085.jpeg',
  'cookware': 'https://images.pexels.com/photos/54455/cook-food-kitchen-eat-54455.jpeg',
  'cricket shoes': 'https://images.pexels.com/photos/159566/cricket-bat-ball-game-159566.jpeg',
  'curtain & blind accessories': 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
  'cushions & accessories': 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg',
  'decorative artificial flora': 'https://images.pexels.com/photos/931159/pexels-photo-931159.jpeg',
  'decorative home accessories': 'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg',
  'dining room furniture': 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg',
  'doormats': 'https://images.pexels.com/photos/4019403/pexels-photo-4019403.jpeg',
  'downhill ski boots': 'https://images.pexels.com/photos/848613/pexels-photo-848613.jpeg',
  'fireplaces, stoves & accessories': 'https://images.pexels.com/photos/266414/pexels-photo-266414.jpeg',
  'garden décor': 'https://images.pexels.com/photos/450517/pexels-photo-450517.jpeg',
  'garden furniture & accessories': 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg',
  'garden storage & housing': 'https://images.pexels.com/photos/450626/pexels-photo-450626.jpeg',
  'general music-making accessories': 'https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg',
  'golf shoes': 'https://images.pexels.com/photos/1325661/pexels-photo-1325661.jpeg',
  'hallway furniture': 'https://images.pexels.com/photos/534172/pexels-photo-534172.jpeg',
  'handmade baby products': 'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg',
  'handmade clothing, shoes & accessories': 'https://images.pexels.com/photos/3738085/pexels-photo-3738085.jpeg',
  'handmade home & kitchen products': 'https://images.pexels.com/photos/269218/pexels-photo-269218.jpeg',
  'handmade home décor': 'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg',
  'health & personal care': 'https://images.pexels.com/photos/373578/pexels-photo-373578.jpeg',
  'hiking hand & foot warmers': 'https://images.pexels.com/photos/374798/pexels-photo-374798.jpeg',
  'hockey shoes': 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg',
  'home bar furniture': 'https://images.pexels.com/photos/1029185/pexels-photo-1029185.jpeg',
  'home entertainment furniture': 'https://images.pexels.com/photos/813940/pexels-photo-813940.jpeg',
  'home office furniture': 'https://images.pexels.com/photos/245032/pexels-photo-245032.jpeg',
  'inflatable beds, pillows & accessories': 'https://images.pexels.com/photos/4820803/pexels-photo-4820803.jpeg',
  'kitchen linen': 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg',
  'kitchen storage & organisation': 'https://images.pexels.com/photos/3952041/pexels-photo-3952041.jpeg',
  'living room furniture': 'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg',
  'mattress pads & toppers': 'https://images.pexels.com/photos/545012/pexels-photo-545012.jpeg',
  'men': 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg',
  "men's sports & outdoor shoes": 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
  'mirrors': 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg',
  'office paper products': 'https://images.pexels.com/photos/301943/pexels-photo-301943.jpeg',
  'office supplies': 'https://images.pexels.com/photos/374631/pexels-photo-374631.jpeg',
  'outdoor cooking': 'https://images.pexels.com/photos/551997/pexels-photo-551997.jpeg',
  'packaging & shipping supplies': 'https://images.pexels.com/photos/4246245/pexels-photo-4246245.jpeg',
  'painting supplies, tools & wall treatments': 'https://images.pexels.com/photos/569159/pexels-photo-569159.jpeg',
  'pens, pencils & writing supplies': 'https://images.pexels.com/photos/159497/pencils-crayons-colorful-colourful-159497.jpeg',
  'plants, seeds & bulbs': 'https://images.pexels.com/photos/450327/pexels-photo-450327.jpeg',
  'professional education supplies': 'https://images.pexels.com/photos/289738/pexels-photo-289738.jpeg',
  'rugs, pads & protectors': 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
  'school & educational supplies': 'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg',
  'ski clothing': 'https://images.pexels.com/photos/848601/pexels-photo-848601.jpeg',
  'snowboard boots': 'https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg',
  'soft toys': 'https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg',
  'storage & home organisation': 'https://images.pexels.com/photos/4241792/pexels-photo-4241792.jpeg',
  'storage & organisation': 'https://images.pexels.com/photos/3791616/pexels-photo-3791616.jpeg',
  'tableware': 'https://images.pexels.com/photos/434258/pexels-photo-434258.jpeg',
  'tennis shoes': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
  'test & measurement': 'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg',
  'vases': 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg',
  'women': 'https://images.pexels.com/photos/2887718/pexels-photo-2887718.jpeg',
  "women's sports & outdoor shoes": 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'
};

export function getCategoryImage(categoryName: string | undefined): string {
  if (!categoryName) return DEFAULT_IMAGE;
  const key = categoryName.toLowerCase();
  // Exact match first
  if (CATEGORY_IMAGE_MAP[key]) return CATEGORY_IMAGE_MAP[key];
  // Keyword contains
  for (const k of Object.keys(CATEGORY_IMAGE_MAP)) {
    if (key.includes(k)) return CATEGORY_IMAGE_MAP[k];
  }
  // Fallback to a generic but category-themed image via Unsplash query
  const url = `https://source.unsplash.com/featured/?${encodeURIComponent(categoryName)}`;
  return url;
}

export const FALLBACK_CATEGORY_IMAGE = DEFAULT_IMAGE;


