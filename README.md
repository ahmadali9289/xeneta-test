# Task 1 - Solution and steps are mentioned below:

## Steps to follow

1. You would need to first install the `node_modules` by running the following command:
### `yarn install`

2. Create a `.env` file at the root level and add the line `API_KEY:"zSTAhrBZFU19GlvU9DzFUarK0gfW7Tx85rsyaVxV"`.

3. Once the `node_modules` are install you can run the following command. 
### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Demo video is present in the following link:

Open [https://www.loom.com/share/da433bca96624d8ebd48adacaf2bc70c](Video Link) here.


# Task 2 - My proposed solution to the requirment:

To handle the user requirment of downloading the image, we could always go with an approach to convert HTML tag to a canvas element which could easily be exported as PNG or JPEG format. For example here are the following steps which could be taken:
 
 1. The code for task 1 has a container component which shows the Graph as well as the prices selected ( MEAN, HIGH, LOW etc). It is wrapped inside a container on a seperate row.
 2. Get the `innerHTML` of the component and put it inside the canvas. 
 3. use the canvas element to export image as PNG and JPEG.

 Other Alternates could be:
 1. Use `html2canvas` JavaScript library to extract out the HTML and export it as PNG or JPEG.
 2. Use `Puppeteer` ( Headless chrome ) to extract out the HTML and export is as an image or JPEG.
