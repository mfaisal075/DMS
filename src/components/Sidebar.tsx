import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native'; // Added useRoute
import Modal from 'react-native-modal';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({isVisible, onClose}) => {
  const navigation = useNavigation<any>();
  const route = useRoute(); // Get current route
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>(
    {},
  );

  // Define your menu structure
  const menuData = {
    Dashboard: [],
    Users: [],
    Donations: [],
    Reports: [],
    Configurations: [],
  };

  // Define icons for each main menu item
  const icons = {
    Dashboard: 'view-dashboard',
    Users: 'account-group',
    Donations: 'hand-heart',
    Reports: 'chart-bar',
    Configurations: 'cog',
  };

  const toggleItem = (item: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleNavigation = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  // Check if item is active (main or submenu)
  const isItemActive = (item: string) => {
    return route.name === item;
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      style={styles.menuModal}>
      <View style={styles.menuContent}>
        {/* User Info Header */}
        <View style={styles.header}>
          <ImageBackground
            source={require('../assets/logo-black.png')}
            style={styles.logo}
            resizeMode="contain"
            tintColor={'#fff'}
          />
        </View>

        {/* Menu Items */}
        <ScrollView style={styles.menuItemsContainer}>
          {Object.entries(menuData).map(([mainItem, subItems]) => (
            <View key={mainItem}>
              {/* Main Menu Item */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isItemActive(mainItem) && styles.activeMenuItem,
                ]}
                onPress={() => {
                  if (subItems.length === 0) {
                    handleNavigation(mainItem);
                  } else {
                    toggleItem(mainItem);
                  }
                }}>
                <View style={styles.menuRow}>
                  <Icon
                    name={icons[mainItem as keyof typeof icons]}
                    size={24}
                    color={isItemActive(mainItem) ? '#fff' : '#6E11B0'}
                    style={styles.menuIcon}
                  />
                  <Text
                    style={[
                      styles.menuText,
                      isItemActive(mainItem) && styles.activeMenuText,
                    ]}>
                    {mainItem}
                  </Text>
                  {subItems.length > 0 && (
                    <Icon
                      name={
                        expandedItems[mainItem] ? 'chevron-up' : 'chevron-down'
                      }
                      size={20}
                      color={isItemActive(mainItem) ? '#fff' : '#144272'}
                      style={styles.chevron}
                    />
                  )}
                </View>
              </TouchableOpacity>

              {/* Submenu Items */}
              {expandedItems[mainItem] && subItems.length > 0 && (
                <View style={styles.subMenu}>
                  {subItems.map(subItem => (
                    <TouchableOpacity
                      key={subItem}
                      style={[
                        styles.subMenuItem,
                        isItemActive(subItem) && styles.activeSubMenuItem,
                      ]}
                      onPress={() => handleNavigation(subItem)}>
                      <Icon
                        name="arrow-right"
                        size={14}
                        color={isItemActive(subItem) ? '#fff' : '#144272'}
                        style={{marginRight: 15}}
                      />
                      <Text
                        style={[
                          styles.subMenuText,
                          isItemActive(subItem) && styles.activeSubMenuText,
                        ]}>
                        {subItem}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Logout Button - Moved to bottom */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            onClose();
            navigation.replace('Login');
          }}>
          <Icon
            name="logout"
            size={24}
            color="#6E11B0"
            style={styles.menuIcon}
          />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  menuModal: {
    margin: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContent: {
    width: 260,
    flex: 1,
    backgroundColor: '#fff',
  },
  menuItemsContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6E11B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    width: 60,
    height: 60,
    tintColor: '#fff',
    alignSelf: 'center',
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 20,
  },
  activeMenuItem: {
    backgroundColor: '#6E11B0',
    borderRadius: 16,
    marginTop: 2,
    paddingVertical: 12,
    marginHorizontal: 10,
    borderBottomWidth: 0,
    borderBottomColor: '#8a3ac7',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#6E11B0',
    fontWeight: '600',
    flex: 1,
  },
  activeMenuText: {
    color: '#fff',
  },
  chevron: {
    marginLeft: 'auto',
  },
  subMenu: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 5,
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingLeft: 60,
  },
  activeSubMenuItem: {
    backgroundColor: '#6E11B0',
  },
  subMenuText: {
    fontSize: 14,
    color: '#144272',
  },
  activeSubMenuText: {
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopColor: '#6E11B0',
    borderTopWidth: 0.5,
  },
  logoutText: {
    fontSize: 16,
    color: '#6E11B0',
    fontWeight: '600',
    marginLeft: 15,
  },
  logo: {
    width: 140,
    height: 110,
  },
});

export default Sidebar;
