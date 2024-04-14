# Q8 Tasweet Election / React Side
`All Routers`
`Router`
`Pages`
`Helper`
`Store` > [actions], actions, actiontype, reducer, sagas


1) Security
- Token Storage: If this is a response to a web client, remember that storing JWT tokens in local storage is not recommended due to potential XSS attacks. Consider using HttpOnly cookies to store the tokens if it's applicable to your use case.
- It's good that you've separated the JWT_SECRET_KEY from the SECRET_KEY. However, you should avoid hardcoding the secret key in the settings.py file for security reasons. Instead, set your JWT_SECRET_KEY as an environment variable:

 
<!-- Adding Image -->



import { uploadNewImage } from "../../store/actions";

const [selectedImage, setSelectedImage] = useState(null);

const handleImageSelect = (e) => {
const imageFile = e.target.files[0];
setSelectedImage(imageFile);
console.log("handleImageSelect called");

};

onSubmit
        image: values.image,
        selectedImage: selectedImage,

      const formData = new FormData();
  
      if (!selectedImage) {
        console.log("no selected image");
      } else {
        formData.append("image", selectedImage);
        formData.append("folder", "elections"); // replace "yourFolderName" with the actual folder name
      }
      
      dispatch(addNewElection({election: newElection, formData: formData}));


      


