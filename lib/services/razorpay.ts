
export const createRazorpayOrder = async (amount: number, receipt: string, notes: { [key: string]: string }) => {
    try {
        const response = await fetch("https://us-central1-small-bites-92c65.cloudfunctions.net/createRazorpayOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                // Optionally add Firebase Auth token here
            },
            body: JSON.stringify({
                amount: amount, // Razorpay expects amount in paise
                currency: "INR",
                receipt: receipt,
                notes: notes
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create Razorpay order");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw error;
    }
};
