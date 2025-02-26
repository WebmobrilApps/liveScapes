import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Image, Linking, ActivityIndicator, Dimensions } from 'react-native';
import COLORS from '../styles/colors';
import { imagePath } from '../configs/imagePath';
import WrapperContainer from '../components/WrapperContainer';
import apiCall from '../configs/api';
import commonStyles from '../styles/commonStyles';
import FONTS from '../styles/fonts';
import { verticalScale } from '../styles/responsiveLayoute';
import Loading from '../components/Loading';
const {height} = Dimensions.get('window')

const Training = (props) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false)
    const [expandedItems, setExpandedItems] = useState({}); // Track expanded items
    const toggleExpanded = (index) => {
        setExpandedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await apiCall({ url: 'get_video_categories' });
            // console.log('cattt', categories);

            if (categories) {
                setCategories(categories);
                if (categories.length > 0) {
                    handlePress(categories[0]); // Preselect the first category
                }
            }
        };


        fetchCategories();
    }, []);

    const handlePress = (category) => {
        setSelectedCategory(category);
        fetchImages(category._id); // Fetch images for the selected category
    };

    const fetchImages = async (categoryId) => {
        setLoading(true)
        const imagesResponse = await apiCall({
            url: 'get_videos?categoryId',
            params: { categoryId: categoryId },
        });
        setLoading(false)

        console.log('image response', imagesResponse);


        if (imagesResponse) {
            setVideos(imagesResponse);
        }
    };
    const isValidUrl = (url) => {
        const urlPattern = new RegExp(
          '^(https?:\\/\\/)?' + // Protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
          '(\\#[-a-z\\d_]*)?$',
          'i'
        );
        return !!urlPattern.test(url);
      };

      const handlePlay = (item) => {
        if (isValidUrl(item)) {
          Linking.openURL(item).catch((err) =>
            Alert.alert('Error', 'Unable to open the URL')
          );
        } else {
          Alert.alert('Invalid URL', 'The URL provided is not valid.');
        }
      };

      const renderItem = ({ item, index }) => {
        const isExpanded = expandedItems[index];
        const description = isExpanded ? item.desc : item.desc.slice(0, 140); // Adjust length as needed
    
        return (
            <View style={[styles.videoContainer]}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {item.thumbnail ? (
                        <Image
                            source={{ uri: `http://18.221.29.249:10030/${item.thumbnail.replace(/\\/g, '/')}` }}
                            style={styles.thumbImg}
                        />
                    ) : (
                        <Image resizeMode='contain' source={imagePath.icon} style={[styles.thumbImg,{borderRadius:0}]} />
                    )}
                </View>
    
                <View style={[commonStyles.flexView, { flex: 1 }]}>
                    <View style={{ justifyContent: 'flex-start', flex: 1, height: '100%' }}>
                        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                        <Text style={styles.subTitle}>{description} {item.desc.length > 200 && ( // Check if "See More" is needed
                                <Text onPress={() => toggleExpanded(index)}
                                style={styles.seeMoreText}>
                                    {isExpanded ? 'See Less' : 'See More'}
                                </Text>
                        )}</Text>
                        
                    </View>
                    <TouchableOpacity onPress={() => handlePlay(item.videoLink)}>
                        <Image source={imagePath.playIcon}
                            style={{ height: 50, width: 50, marginLeft: 5,resizeMode:'contain' }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <WrapperContainer wrapperStyle={styles.main}>
            <Loading visible={loading}/>
            <FlatList
                ListHeaderComponent={() => (
                    <FlatList
                        horizontal
                        data={categories}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                key={item._id}
                                style={selectedCategory && selectedCategory._id === item._id ? styles.selectedCategory : styles.category}
                                onPress={() => handlePress(item)}>
                                <Text numberOfLines={1} style={selectedCategory && selectedCategory._id === item._id ? styles.selectedCategoryText : styles.categoryText}>
                                    {item.category}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
                data={videos}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.imageGallery}
                ListEmptyComponent={<View style={{flex:1,justifyContent:'center',alignItems:'center',height:height/1.3}}>
                    <Text style={styles.title}>No Data Found</Text>
                </View>}
            />
        </WrapperContainer>
    );
};

export default Training;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center'
    },
    category: {
        backgroundColor: 'white',
        height: 35,
        width: 114,
        margin: 4,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    selectedCategory: {
        backgroundColor: '#009EA7',
        height: 35,
        width: 114,
        margin: 4,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20
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
        marginVertical: verticalScale(20),
    },
    videoContainer: {
        width:'98%',
        padding: 10,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(20),
        alignSelf:'center'
        // alignItems:'center'
    },
    thumbImg: {
        height: 80,
        width: 80,
        borderRadius: 10,
        marginRight: 10
    },
    title: {
        fontFamily: FONTS.InterMedium,
        fontSize: 14,
        color: COLORS.whiteColor,
        marginRight: 10
    },
    subTitle: {
        fontFamily: FONTS.InterMedium,
        fontSize: 12,
        color: COLORS.whiteColor
    },
    playBtn: {
        backgroundColor: COLORS.whiteColor,
        borderRadius: 40,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    playBtnIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.blackColor
    },
    seeMoreText: {
        color: COLORS.primary,
        fontSize: 12,
        fontFamily: FONTS.InterMedium,
        marginTop: 5,
        textDecorationLine: 'underline',
    },
});
