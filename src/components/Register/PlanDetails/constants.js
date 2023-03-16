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
        savings: '500',
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
        savings: '750',
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
        savings: '1000',
    },
];

export const planStats = [
    {
        id: 1,
        title: "Pay - Monthly",
        items: [
            { 1: "₹ 449/-", 3: "₹ 399/-", 12: "₹ 358/-"},
            { 1: "₹ 649/-", 3: "₹ 599/-", 12: "₹ 533/-"},
            { 1: "₹ 849/-", 3: "₹ 799/-", 12: "₹ 716/-"},
            // { text: "₹ 599/-", strikedText: "₹ 799/-" },
            // { text: "₹ 799/-", strikedText: "₹ 1199/-" },
        ],
    },
    {
        id: 2,
        title: "Delivered - Weekly",
        items: [
            { text: "One Book" },
            { text: "Two Books" },
            { text: "Four Books" },
        ],
    },
    {
        id: 3,
        title: "Total - Monthly",
        items: [
            { text: "Four Books" },
            { text: "Eight Books" },
            { text: "Sixteen Books" },
        ],
    },
];

export const planPrices = {
    1: {1: 449, 3: 1199, 12: 4299},
    2: {1: 649, 3: 1799, 12: 6399},
    4: {1: 849, 3: 2399, 12: 8599},
};