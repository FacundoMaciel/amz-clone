document.addEventListener('DOMContentLoaded', function () {
  const offers = [
    {
      image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
      name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
      priceCents: 1090,
      originalCents: 1999,
      discount: 45
    },
    {
      image: 'images/products/intermediate-composite-basketball.jpg',
      name: 'Intermediate Size Basketball',
      priceCents: 2095,
      originalCents: 2999,
      discount: 30
    },
    {
      image: 'images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg',
      name: 'Adults Plain Cotton T-Shirt - 2 Pack',
      priceCents: 799,
      originalCents: 1499,
      discount: 47
    },
    {
      image: 'images/products/black-2-slot-toaster.jpg',
      name: '2 Slot Toaster - Black',
      priceCents: 1899,
      originalCents: 2999,
      discount: 37
    },
    {
      image: 'images/products/6-piece-non-stick-baking-set.webp',
      name: '6-Piece Nonstick Carbon Steel Bakeware Set',
      priceCents: 3499,
      originalCents: 5499,
      discount: 36
    },
    {
      image: 'images/products/plain-hooded-fleece-sweatshirt-yellow.jpg',
      name: 'Plain Hooded Fleece Sweatshirt',
      priceCents: 2400,
      originalCents: 3999,
      discount: 40
    },
    {
      image: 'images/products/luxury-tower-set-6-piece.jpg',
      name: 'Luxury Towel Set - Graphite Gray',
      priceCents: 3599,
      originalCents: 5999,
      discount: 40
    },
    {
      image: 'images/products/knit-athletic-sneakers-gray.jpg',
      name: 'Waterproof Knit Athletic Sneakers - Gray',
      priceCents: 3390,
      originalCents: 5499,
      discount: 38
    },
    {
      image: 'images/products/women-chiffon-beachwear-coverup-black.jpg',
      name: "Women's Chiffon Beachwear Cover Up - Black",
      priceCents: 2070,
      originalCents: 3299,
      discount: 37
    },
    {
      image: 'images/products/round-sunglasses-black.jpg',
      name: 'Round Sunglasses',
      priceCents: 1560,
      originalCents: 2499,
      discount: 38
    },
    {
      image: 'images/products/women-beach-sandals.jpg',
      name: "Women's Two Strap Buckle Sandals - Tan",
      priceCents: 2499,
      originalCents: 3999,
      discount: 38
    },
    {
      image: 'images/products/men-slim-fit-summer-shorts-gray.jpg',
      name: "Men's Slim-Fit Summer Shorts",
      priceCents: 1699,
      originalCents: 2799,
      discount: 39
    },
    {
      image: 'images/products/electric-glass-and-steel-hot-water-kettle.webp',
      name: 'Electric Hot Tea Water Kettle - 1.7L',
      priceCents: 3074,
      originalCents: 4999,
      discount: 39
    },
    {
      image: 'images/products/men-golf-polo-t-shirt-blue.jpg',
      name: "Men's Quick-Dry Golf Polo Shirt",
      priceCents: 1599,
      originalCents: 2699,
      discount: 41
    },
    {
      image: 'images/products/coffeemaker-with-glass-carafe-black.jpg',
      name: 'Coffeemaker with Glass Carafe - 25 Oz',
      priceCents: 2250,
      originalCents: 3499,
      discount: 36
    },
    {
      image: 'images/products/non-stick-cooking-set-15-pieces.webp',
      name: 'Non-Stick Cookware Set - 15 Pieces',
      priceCents: 6797,
      originalCents: 9999,
      discount: 32
    },
    {
      image: 'images/products/men-athletic-shoes-green.jpg',
      name: "Men's Athletic Sneaker",
      priceCents: 3890,
      originalCents: 5999,
      discount: 35
    },
    {
      image: 'images/products/duvet-cover-set-blue-twin.jpg',
      name: 'Duvet Cover Set with Zipper Closure',
      priceCents: 2399,
      originalCents: 3799,
      discount: 37
    },
    {
      image: 'images/products/straw-sunhat.webp',
      name: 'Straw Lifeguard Sun Hat',
      priceCents: 2200,
      originalCents: 3499,
      discount: 37
    },
    {
      image: 'images/products/women-stretch-popover-hoodie-black.jpg',
      name: "Women's Stretch Popover Hoodie",
      priceCents: 1374,
      originalCents: 2299,
      discount: 40
    }
  ];

  function formatPrice(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  const carousel = document.querySelector('.js-offers-carousel');
  const wrapper = document.querySelector('.js-offers-wrapper');
  if (!carousel || !wrapper) return;

  carousel.innerHTML = offers.map(offer => `
    <div class="offer-card">
      <div class="offer-card-body">
        <div class="offer-badge">-${offer.discount}%</div>
        <div class="offer-image-container">
          <img class="offer-image" src="${offer.image}" alt="${offer.name}">
        </div>
        <div class="offer-name">${offer.name}</div>
        <div class="offer-prices">
          <span class="offer-price">${formatPrice(offer.priceCents)}</span>
          <span class="offer-original-price">${formatPrice(offer.originalCents)}</span>
        </div>
      </div>
    </div>
  `).join('');

  let currentIndex = 0;

  function getStep() {
    const card = carousel.querySelector('.offer-card');
    if (!card) return 0;
    return card.offsetWidth + 16;
  }

  function getMaxIndex() {
    const step = getStep();
    if (step === 0) return 0;
    const visible = Math.floor(wrapper.offsetWidth / step);
    return Math.max(0, offers.length - visible);
  }

  function applyTransform() {
    carousel.style.transform = `translateX(-${currentIndex * getStep()}px)`;
  }

  function slide(dir) {
    const max = getMaxIndex();
    currentIndex += dir;
    if (currentIndex > max) currentIndex = 0;
    if (currentIndex < 0) currentIndex = max;
    applyTransform();
  }

  document.querySelector('.js-offers-prev').addEventListener('click', () => slide(-1));
  document.querySelector('.js-offers-next').addEventListener('click', () => slide(1));

  let timer = setInterval(() => slide(1), 4000);

  wrapper.addEventListener('mouseenter', () => clearInterval(timer));
  wrapper.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => slide(1), 4000);
  });

  window.addEventListener('resize', () => {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    applyTransform();
  });
});
