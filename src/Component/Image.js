import React from "react";
import "./Image.css";
import { useState, useEffect } from "react";

function Image() {
  let [image, setImage] = useState([]);
  let [selectedImage, setSelectedImage] = useState([]);

  //I tried to use useEffect to save the images, but they did not work properly
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

  function gettingImmediatelyAfterElement(imageContainer, xAxisPosition) {
    let elementsExceptTheDraggingImage = [
      ...imageContainer.querySelectorAll(".image:not(.the-dragging-element)"),
    ];

    return elementsExceptTheDraggingImage.reduce(
      (immediateOne, element) => {
        let immediateElementsDetail = element.getBoundingClientRect();

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

  function toggleImageSelection(id) {
    if (selectedImage.includes(id)) {
      setSelectedImage(selectedImage.filter((imgId) => imgId !== id));
    } else {
      setSelectedImage([...selectedImage, id]);
    }
  }

  function deleteSelectedImage() {
    let updatedImage = image.filter((img) => !selectedImage.includes(img.id));

    setImage(updatedImage);
    setSelectedImage([]);
  }

  return (
    <>
      <>
        <div className="top-part">
          {selectedImage.length > 0 && (
            <>
              <div>{selectedImage.length} Images Selected</div>
              <button className="dlt-button" onClick={deleteSelectedImage}>
                Delete Images
              </button>
            </>
          )}
          {selectedImage.length === 0 && <h2>Image Gallery</h2>}
        </div>
      </>

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

        <button className="add-image-button" className="add-image-button">
          Add Image
          <input type="file" accept="image/*" onChange={addImage} />{" "}
        </button>
      </div>
    </>
  );
}
export default Image;
