# Small Bites - Smart Canteen Application

Small Bites is a smart canteen application designed to modernize the campus food ordering experience at NIT Delhi. Its primary goal is to provide a digital and user-centric platform to address issues like long queues, slow order processing, and limited menu transparency in campus canteens. The app allows students and faculty to pre-order meals and receive real-time updates on their orders. It also provides tools for canteen vendors to manage their menus and orders.

## Key Features

### User App Features:

*   **Authentication & Profile Management:** Secure login using Google Sign-In and profile management.
*   **Menu Browse:** Explore food items with details (description, price, calories, ratings).
*   **Favorites Management:** Mark favorite food items and canteens for quick access.
*   **Cart Management:** Add, remove, update item quantities, and review total cost.
*   **Order Management:** Place orders, track real-time status (Ordered, Preparing, Ready), and view order history.
*   **Search & Filters:** Search for canteens/dishes by keywords; filter by food type, price, dietary preferences.
*   **Checkout & Payment:** Flexible checkout with online/cash payment options and pickup/delivery time slots.
*   **Expense Tracker:** Automatic transaction logging with daily/weekly/monthly spending breakdowns, filters, and visual summaries.
*   **Review System:** Submit reviews and star ratings for items; view others' reviews.

### Canteen App Features:

*   **Canteen Registration & Profile Management:** Register and manage canteen profile, including operational hours.
*   **Menu Management:** Add, edit, remove menu items; update availability, pricing, photos, and details.
*   **Order Tracking:** View incoming orders in real-time, update statuses (Accepted, Preparing, Ready), and view past orders.
*   **Analytics Dashboard:** Insights into total orders, revenue statistics, and top-selling items.
*   **View User Reviews:** Access user feedback to improve service and quality.

## Getting Started (Development)

This project uses Expo.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the app:**
    ```bash
    npx expo start
    ```

    Follow the instructions in the terminal to open the app in an emulator, simulator, or the Expo Go app.

## Project Structure

The project follows a standard Expo project structure with file-based routing in the `app/` directory. Key directories include:

*   `app/`: Contains the screens and navigation logic (user and canteen flows).
*   `assets/`: Static assets like images.
*   `components/`: Reusable UI components.
*   `constants/`: Application constants (e.g., theme, config).
*   `context/`: React Context providers (e.g., OrderContext).
*   `functions/`: Firebase Cloud Functions (e.g., for payment integration).
*   `lib/`: Core logic, hooks, services (Auth, Firebase, etc.).

## Learn More

*   [Expo Documentation](https://docs.expo.dev/)
*   [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
*   [Firebase Documentation](https://firebase.google.com/docs)
*   [React Native Documentation](https://reactnative.dev/docs)

## Community

*   [Expo on GitHub](https://github.com/expo/expo)
*   [Expo Discord Community](https://chat.expo.dev)
