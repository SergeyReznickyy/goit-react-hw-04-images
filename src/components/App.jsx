import React, { useState, useEffect } from 'react';
import { Modal } from './Modal/Modal.jsx';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery.jsx';
import { Button } from './Button/Button.jsx';
import imagesAPI from 'api/api.js';
import { ToastContainer, toast } from 'react-toastify';
import { MagnifyingGlass } from 'react-loader-spinner';
import 'react-toastify/dist/ReactToastify.css';
import css from './App.module.css';

export const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndCollection, setIsEndCollection] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalImageURL, setModalImageURL] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await imagesAPI.getImages(searchValue, page);

        setImages(prevImages => [...prevImages, ...response.hits]);

        if (!response.totalHits) {
          toast.error(
            'Sorry, there are no images matching your search query. Please try again'
          );
        }

        const totalPages = Math.ceil(response.totalHits / 12);

        if (page === totalPages) {
          setIsEndCollection(true);
          toast.success('No more pictures');
        }
      } catch (error) {
        console.log('Error', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (page > 1 || searchValue) {
      fetchData();
    }
  }, [page, searchValue]);

  const openModal = (url, tags) => {
    console.log(tags);
    setIsShowModal(true);
    setModalImageURL(url);
    setTags(tags);
  };

  const closeModal = () => {
    setIsShowModal(false);
    setModalImageURL('');
    setTags('');
  };

  const formSubmitHandle = searchValue => {
    setSearchValue(searchValue);
    setImages([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className={css.App}>
      {isShowModal && (
        <Modal onClose={closeModal}>
          <img src={modalImageURL} alt={tags} />
        </Modal>
      )}
      <Searchbar onSubmit={formSubmitHandle} />
      {images.length > 0 && (
        <ImageGallery images={images} onClick={openModal} />
      )}
      {images.length > 0 && !isEndCollection && (
        <Button onClick={handleLoadMore} />
      )}
      {isLoading && (
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="MagnifyingGlass-loading"
          wrapperStyle={{}}
          wrapperClass="MagnifyingGlass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      )}
      <ToastContainer />
    </div>
  );
};
