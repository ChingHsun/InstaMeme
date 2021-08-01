# InstaMeme

A gallery website for exploring and creating memes that cares about user-experience.

[>>View the site!](https://instameme-7d4c3.web.app/)
![summary](https://github.com/ChingHsun/InstaMeme/raw/master/media/summary.png)

## Technologies

- Front-End

  - RWD
  - ReactJS / React Hooks / Custom Hooks
  - React Router
  - Redux / redux-thunk / redux-logger
  - Intersection Observer API
  - React Window / React Window Infinite Loader
  - Formik / Yup

- UI

  - Styled Components
  - Chakra UI
  - React Animation

- Canvas

  - Fabric JS

- Firebase
  - Authentication
  - Storage
  - Firestore

## Flow Chart

![FlowChart](https://github.com/ChingHsun/InstaMeme/raw/master/media/flowchart.png)

## Features

### Browse Memes

- Browse memes and select themes or change order, and design different UI for mobile devices.

- Meme Detail:

  - Common Feature:

    - Open meme detail will update the view count of meme
    - add comment

  - Desktop or Tablet:
    - Preview memes information and click to browse more details.
    - Popout the meme modal and change the router, while close the modal than go back to orginal router.
    - If refresh the page will go to the meme page.
  - Mobile:
    - Click plus button for more detail, and the close button to flip back
    - Control the cards that could only flip one

- Save Meme:
  - Choose a category to save, or the catogory of "all"
  - Add the new category if you want
  - Change the save button, and update the save count for the meme information

### Create Meme

- Browse all template to create your meme

- Add your text on the template
- Adjust your text style such as color, size, stroke, text align, background and so on.

- Add your own signature for your meme

- Done and name your meme:

  - Publish in public and choose at most 3 themes

  - Download privately to your own device

### Create Template

- Upload your own picture (you could click or drag image) and name your template
- Design your intial text box for the template
- Upload template and alert users that template could not be delete

### User

- Login/SignUp

- Profile page for saved memes and created memes
- Change your profile and picture
- Delete saved memes for all category
- Delete saved memes in certain category but still saved
- Delete memes you create

### Search

- Search for memes and templates

## Future Features

Add Facebook/Google account login
Add next meme button for meme modal
Adopt Next.js to have better reduce loading time and get better SEO
Add more function for creating meme such as upload image

## Contact

Feel free to contact me if you have any questions.
E-mail: carol331536@gmail.com
