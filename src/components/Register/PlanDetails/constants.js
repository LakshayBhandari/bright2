export const plans = [
  {
    title: "Basic",
    bookCount: "1",
    price: "399",
    backgroundColor: "#FFE6E3",
    borderColor: "#F75549",
    image: "/images/Art/plan-1.png",
    planId: 1,
    razorpayId: "plan_Kfp8XM8HNym5or",
    savings: "500",
  },
  {
    title: "Standard",
    bookCount: "2",
    price: "599",
    actualPrice: "799",
    backgroundColor: "#F0FEDF",
    borderColor: "#33A200",
    image: "/images/Art/plan-2.png",
    planId: 2,
    razorpayId: "plan_KfpBDN0ZyGY29s",
    savings: "750",
  },
  {
    title: "Premium",
    bookCount: "4",
    price: "799",
    actualPrice: "1199",
    backgroundColor: "#DEF2FF",
    borderColor: "#1596DC",
    image: "/images/Art/plan-3.png",
    planId: 3,
    razorpayId: "plan_KfpCxeWR1J5CkD",
    savings: "1000",
  },
];

export const planStats = [
  {
    id: 1,
    title: "Monthly - Payment",
    items: [
      { 3: "₹ 399/-", 6: "₹ 366/-", 12: "₹ 349/-" },
      { 3: "₹ 599/-", 6: "₹ 566/-", 12: "₹ 533/-" },
      { 3: "₹ 799/-", 6: "₹ 749/-", 12: "₹ 716/-" },
      // { 1: "₹ 849/-", 3: "₹ 799/-", 12: "₹ 716/-", strikedText: "₹ 1199/-"},
    ],
  },
  {
    id: 2,
    title: "Number of Books",
    items: [
      { 3: "Twelve", 6: "Twenty-Four", 12: "Fourty-Eight" },
      { 3: "Twenty-Four", 6: "Fourty-Eight", 12: "Ninety-Six" },
      { 3: "Fourty-Eight", 6: "Ninety-Six", 12: "One Hundred & Ninety-Two" },
    ],
  },
  {
    id: 3,
    title: "Number of Delivery",
    items: [
      { 3: "Twelve", 6: "Twenty-Four", 12: "Fourty-Eight" },
      { 3: "Twelve", 6: "Twenty-Four", 12: "Fourty-Eight" },
      { 3: "Twelve", 6: "Twenty-Four", 12: "Fourty-Eight" },
    ],
  },
  {
    id: 4,
    title: "Duration",
    items: [
      { 3: "12 Weeks", 6: "24 Weeks", 12: "48 Weeks" },
      { 3: "12 Weeks", 6: "24 Weeks", 12: "48 Weeks" },
      { 3: "12 Weeks", 6: "24 Weeks", 12: "48 Weeks" },
    ],
  },
];

export const planPrices = {
  1: { 3: 1199, 6: 2199, 12: 4199 },
  2: { 3: 1799, 6: 3399, 12: 6399 },
  4: { 3: 2399, 6: 4499, 12: 8599 },
};
