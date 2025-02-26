import EditImage from "../screens/EditImage";
import Home from "../screens/Home";
import InitialScreen from "../screens/InitialScreen";
import SelectCategory from "../screens/SelectedCategory";
import Training from "../screens/Training";
import Welcome from "../screens/Welcome";
import ScreenNameEnum from "./screenName";

Welcome

const _routes = [
        {
            name: ScreenNameEnum.INITIAL_SCREEN,
            Component: InitialScreen,
            headerShown:false
        },
        {
            name: ScreenNameEnum.WELCOME_SCREEN,
            Component: Welcome,
            headerShown:false
        },
        {
            name: ScreenNameEnum.HOME_SCREEN,
            Component: Home,
            headerShown:false
        },
        {
            name: ScreenNameEnum.EDIT_IMAGE,
            Component: EditImage,
            headerShown:false
        },
        {
            name: ScreenNameEnum.SELECTED_CATEGORY,
            Component: SelectCategory,
            headerShown:true
        },
        {
            name: ScreenNameEnum.TRAINING,
            Component: Training,
            headerShown:true
        },
]

export default _routes;
