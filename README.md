# bamazon
bamazon is a command line application that offers full functionality for managing a store's inventory. The application not only updates for customer purchases, inventory restocking and new products, but also aggregates information about inventory and store revenue into easy to read tables for managers and supervisors. bamazon consists of three JavaScript programs (one for customers, one for managers and one for supervisors) that seamlessly communicate with a MySQL database to offer the latest information regarding the store's inventory and sales.

## bamazonCustomer.js
`bamazonCustomer.js` allows customers to view the store's inventory and place orders. When this program is opened, it displays the store's inventory and prompts the customer to place his / her order.

<img src = '/bamazon_screenshots/bamazonCustomer.js_screenshots/screenshot_1.png' width = '400' align = 'center'>

Once prompted, the customer can navigate to the item he / she wishes to purchase by using the `up arrow` and `down arrow` keys.

<img src = '/bamazon_screenshots/bamazonCustomer.js_screenshots/customer_menu_navigation.gif' width = '400' align = 'center'>

If the customer decides not to place an order after viewing the inventory, he / she can select `Exit Store` when prompted to select an item to purchase.

After selecting an item, the customer will be asked for the number of units he / she wishes to purchase. If the customer's input exceeds the store's stock, the program will notify the customer and ask him / her to place another order shortly afterwards. As before, the customer can choose to exit the store when this occurs.

<img src = '/bamazon_screenshots/bamazonCustomer.js_screenshots/screenshot_2.png' width = '400' align = 'center'>

However, if the store can fulfill the customer's order, the program will notify the customer of the order price and then re-direct him / her to the opening display. At this point, the customer can either exit the program or place another order.

<img src = '/bamazon_screenshots/bamazonCustomer.js_screenshots/screenshot_3.png' width = '400' align = 'center'>
