import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import {imagePath} from '../configs/imagePath';
import ScreenNameEnum from '../configs/screenName';
import WrapperContainer from '../components/WrapperContainer';
import apiCall from '../configs/api';
import FastImage from 'react-native-fast-image';
import Loading from '../components/Loading';
import ImageWithLoader from '../components/ImageWithLoader';

const SelectCategory = props => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState({}); // Track loading for each image
  const [loading, setLoading] = useState(false);
  const categoryListRef = useRef(null); // Ref for the categories FlatList
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const [currentCategoryId, setCurrentCategoryId] = useState(
    categories[0]?.id || null,
  );
  const calculateColumns = () => {
    const itemWidth = 116 + 10; // Image width + margin
    return Math.floor(screenWidth / itemWidth); // Calculate how many items fit in one row
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await apiCall({url: 'get-categories'});
      if (categories && categories.length > 0) {
        setCategories(categories);
        setSelectedCategory(categories[0]); // Preselect the first category
        setSelectedCategoryIndex(0); // Index of the first category
        fetchImages(categories[0]._id); // Fetch images for the first category
      }
    };
    fetchCategories();
  }, []);

  const handlePress = (category, index) => {
    if (typeof index !== 'number' || index < 0 || index >= categories.length) {
      console.warn('Invalid index for scrollToIndex:', index);
      return;
    }

    setSelectedCategory(category);
    setSelectedCategoryIndex(index); // Store the index of the selected category
    fetchImages(category._id); // Fetch images for the selected category

    // Scroll to the selected category index
    if (categoryListRef.current) {
      try {
        categoryListRef.current.scrollToIndex({animated: true, index});
      } catch (error) {
        console.error('ScrollToIndex error:', error.message);
      }
    }
  };

  const fetchImages = async categoryId => {
    // console.log('fdsafasdfasdfas',categoryId);

    setLoading(true);
    const imagesResponse = await apiCall({
      url: 'get-categories',
      params: {id: categoryId},
    });
    setLoading(false);
    if (imagesResponse) {
      setImages(
        imagesResponse.images.map(image => ({
          uri: `http://18.221.29.249:10030/${image.replace(/\\/g, '/')}`,
        })),
      );
      // setSelectedImages([]); // Reset selected images when category changes
      setLoadingImages({}); // Reset the loading state
    }
  };
  const handleImageSelect = (image, categoryId) => {
    setSelectedImages(prevState => {
      const categoryImages = prevState[categoryId] || [];
      if (categoryImages.some(img => img.uri === image.uri)) {
        // Deselect image
        return {
          ...prevState,
          [categoryId]: categoryImages.filter(img => img.uri !== image.uri),
        };
      } else {
        // Add image to the category
        return {
          ...prevState,
          [categoryId]: [...categoryImages, image],
        };
      }
    });
  };
  // const handleImageSelect = image => {
  //   if (selectedImages.includes(image)) {
  //     setSelectedImages(selectedImages.filter(img => img !== image)); // Deselect the image
  //   } else {
  //     setSelectedImages([...selectedImages, image]); // Select the image
  //   }
  // };

  useEffect(() => {
    const {selectedImage: existingImages = []} = props.route.params || {};
    // console.log('selectedImages: existingImages', existingImages);

    setSelectedImages(existingImages); // Preload selected images if any
  }, []);

  const handleNextPress = () => {
    // Check if there are any selected images across all categories
    const hasSelectedImages = Object.values(selectedImages).some(
      categoryImages => categoryImages.length > 0,
    );

    if (hasSelectedImages) {
      const existingImages = props.route.params?.selectedImage || [];
      // console.log('selectedImages11111: existingImages', existingImages);

      // Flatten selectedImages and merge with existingImages
      const updatedImages = [
        ...new Set([
          ...existingImages,
          ...Object.values(selectedImages).flat(),
        ]),
      ]; // Merge and remove duplicates

      // console.log('updatedImages: existingImages', updatedImages);

      props.navigation.navigate(ScreenNameEnum.EDIT_IMAGE, {
        selectedImages: updatedImages, // Pass updated selected images
      });
    } else {
      Alert.alert('Please select at least one image to proceed');
    }
  };
  // const handleNextPress = () => {
  //   if (selectedImages.length > 0) {
  //     const existingImages = props.route.params?.selectedImage || [];
  //     console.log('selectedImages11111: existingImages', existingImages);
  //     const updatedImages = [
  //       ...new Set([...existingImages, ...selectedImages]),
  //     ]; // Merge and remove duplicates
  //     console.log('updatedImages: existingImages', updatedImages);
  //     props.navigation.navigate(ScreenNameEnum.EDIT_IMAGE, {
  //       selectedImages: updatedImages, // Pass updated selected images
  //     });
  //   } else {
  //     Alert.alert('Please select at least one image to proceed');
  //   }
  // };

  const renderItem = ({item}) => {
    const isSelected =
      selectedImages[selectedCategory._id]?.some(img => img.uri === item.uri) ||
      false; // Check if the image is selected for the current category
    // console.log(
    //   'selectedCategory._id',
    //   selectedCategory._id,
    //   isSelected,
    //   selectedImages,
    // );

    return (
      <TouchableOpacity
        onPress={() => handleImageSelect(item, selectedCategory._id)}>
        <View
          style={[
            styles.imageContainer,
            isSelected && styles.selectedImageBorder, // Apply border if selected
          ]}>
          <ImageWithLoader
            source={{uri: item.uri}}
            resizeMode="contain"
            style={styles.galleryImage} // Keep the image styling consistent
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <WrapperContainer wrapperStyle={styles.main}>
      <Loading visible={loading} />
      <FlatList
        ListHeaderComponent={() => (
          <FlatList
            ref={categoryListRef}
            horizontal
            data={categories}
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={item._id}
                style={
                  selectedCategory && selectedCategory._id === item._id
                    ? styles.selectedCategory
                    : styles.category
                }
                onPress={() => handlePress(item, index)}>
                <Text
                  style={
                    selectedCategory && selectedCategory._id === item._id
                      ? styles.selectedCategoryText
                      : styles.categoryText
                  }>
                  {item.category}
                </Text>
              </TouchableOpacity>
            )}
            extraData={selectedCategoryIndex} // Ensure the list re-renders correctly when a category is selected
            initialScrollIndex={
              categories.length > 0 ? selectedCategoryIndex : undefined
            } // Scroll to the selected category on re-render
            getItemLayout={(data, index) => ({
              length: 118,
              offset: 118 * index,
              index,
            })}
          />
        )}
        data={images}
        numColumns={calculateColumns()}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.imageGallery}
      />

      <TouchableOpacity style={styles.Next} onPress={handleNextPress}>
        <Text style={styles.Nex}>Next</Text>
        <Image source={imagePath.olivearrow} style={styles.Aro} />
      </TouchableOpacity>
    </WrapperContainer>
  );
};

export default SelectCategory;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginTop: 15,
    height: 50,
    backgroundColor: 'green',
  },
  category: {
    backgroundColor: 'white',
    height: 35,
    width: 114,
    margin: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedCategory: {
    backgroundColor: '#009EA7',
    height: 35,
    width: 114,
    margin: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: '#009EA7',
    fontSize: 12,
    marginLeft: 5,
    marginRight: 5,
  },
  selectedCategoryText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
    marginRight: 5,
  },
  imageGallery: {
    marginTop: 20,
  },
  galleryImage: {
    width: 116,
    height: 116,
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  selectedGalleryImage: {
    width: 116,
    height: 116,
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#009EA7',
  },
  Next: {
    borderRadius: 40,
    alignSelf: 'center',
    position: 'absolute',
    width: 170,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    bottom: 20,
  },
  Nex: {
    color: '#009EA7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  Aro: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginTop: 2,
    marginLeft: 3,
  },
  imageContainer: {
    marginHorizontal: 5,
    marginBottom: 15,
    borderRadius: 10, // To match the image border radius
  },
  selectedImageBorder: {
    borderWidth: 3,
    borderColor: '#009EA7',
  },
  galleryImage: {
    width: 116,
    height: 116,
    borderRadius: 10,
  },
});
