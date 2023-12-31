import React from "react";
import "./Image.css";
import { useState, useEffect } from "react";

function Image() {
  let [image, setImage] = useState([]);
  let [selectedImage, setSelectedImage] = useState([]);

  //I tried to use useEffect to save the images
  useEffect(() => {
    let savedImage = localStorage.getItem("galleryImage");
    if (savedImage) {
      setImage(JSON.parse(savedImage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("galleryImage", JSON.stringify(image));
  }, [image]);

  //adding a class after starting dragging
  function dragStart(e) {
    e.target.classList.add("the-dragging-element");
  }

  //removing the class after the ending of dragging
  function dragEnd(e) {
    e.target.classList.remove("the-dragging-element");
  }

  //this is to add image from local storage
  function addImage(event) {
    let selectedImage = event.target.files[0];
    if (selectedImage) {
      let newImage = {
        id: image.length,
        src: URL.createObjectURL(selectedImage),
        alt: "New Image",
      };
      let updatedImage = [...image, newImage];
      setImage(updatedImage);
    }
  }

  //this is to add the dragged element before its nearest element in the x axis
  function dragOver(e) {
    e.preventDefault();
    let theDraggingImage = document.querySelector(".the-dragging-element");
    let imageContainer = e.currentTarget;

    if (theDraggingImage !== null) {
      let immediatelyAfterElement = gettingImmediatelyAfterElement(
        imageContainer,
        e.clientX
      ).immediateElement;

      if (immediatelyAfterElement !== null) {
        imageContainer.insertBefore(theDraggingImage, immediatelyAfterElement);
      }
    }
  }

  //this is to find out the nearest element from the mouse cursor in the x axis
  function gettingImmediatelyAfterElement(imageContainer, xAxisPosition) {
    let elementsExceptTheDraggingImage = [
      ...imageContainer.querySelectorAll(".image:not(.the-dragging-element)"),
    ];

    //to get an object of offset and the element
    return elementsExceptTheDraggingImage.reduce(
      (immediateOne, element) => {
        let immediateElementsDetail = element.getBoundingClientRect();
        //offset from the nearest element
        let offsetFromTheDraggingElement =
          xAxisPosition -
          immediateElementsDetail.left -
          immediateElementsDetail.width / 2;

        if (
          offsetFromTheDraggingElement < 0 &&
          offsetFromTheDraggingElement >
            immediateOne.offsetFromTheDraggingElement
        ) {
          return {
            offsetFromTheDraggingElement,
            immediateElement: element,
          };
        } else {
          return immediateOne;
        }
      },
      { offsetFromTheDraggingElement: Number.NEGATIVE_INFINITY }
    );
  }

  //this is to select/unselect images
  function toggleImageSelection(id) {
    if (selectedImage.includes(id)) {
      setSelectedImage(selectedImage.filter((imgId) => imgId !== id));
    } else {
      setSelectedImage([...selectedImage, id]);
    }
  }

  //this is to delete selected images
  function deleteSelectedImage() {
    let updatedImage = image.filter((img) => !selectedImage.includes(img.id));

    setImage(updatedImage);
    setSelectedImage([]);
  }

  return (
    <>
      <>
        {/* top part  */}
        <div className="top-part">
          {selectedImage.length > 0 && (
            <>
              <h3>{selectedImage.length} Images Selected</h3>

              <button className="dlt-button" onClick={deleteSelectedImage}>
                Delete Image
              </button>
            </>
          )}
          {selectedImage.length === 0 && <h3>Image Gallery</h3>}
        </div>
      </>

      {/* this is the images container */}
      <div className="image-grid" onDragOver={dragOver}>
        {image.map((img) => (
          <img
            id={img.id}
            src={img.src}
            alt={img.alt}
            draggable="true"
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            className={`image ${
              selectedImage.includes(img.id) ? "selected" : ""
            }`}
            onClick={() => toggleImageSelection(img.id)}
          />
        ))}

        {/* button to add image */}
        <button className="add-image-button" className="add-image-button">
          Add Image
          <input type="file" accept="image/*" onChange={addImage} />{" "}
        </button>
      </div>
    </>
  );
}
export default Image;
