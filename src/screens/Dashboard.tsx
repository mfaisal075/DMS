import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Dashboard = ({navigation}: any) => {
  // Action buttons data
  const actionButtons = [
    {id: 'Users', icon: 'account-group', color: '#FF6B6B'},
    {id: 'Donations', icon: 'hand-heart', color: '#4ECDC4'},
    {id: 'Reports', icon: 'chart-bar', color: '#FFD166'},
    {id: 'Configurations', icon: 'cog', color: '#6A0572'},
  ];

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBarContainer}>
        <Image
          source={require('../assets/logo-black.png')}
          style={{width: 120, height: 120}}
          tintColor={'#fff'}
          resizeMode="contain"
        />
        <TouchableOpacity>
          <Icon name="account-circle" size={50} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Balance Cards - Now vertical layout */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>

        <View style={styles.cardsContainer}>
          {/* Total Donations Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardText}>Total Donations</Text>
              <Icon name="cash" size={24} color="#6E11B0" />
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardBalText}>PKR 1,000</Text>
              <View style={styles.cardMeta}>
                <View style={styles.cardMetaItem}>
                  <Icon name="calendar" size={16} color="#8E8E93" />
                  <Text style={styles.cardMonthText}>June 2025</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Yearly Donations Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardText}>Yearly Donations</Text>
              <Icon name="calendar" size={24} color="#6E11B0" />
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardBalText}>PKR 53,000</Text>
              <View style={styles.cardMeta}>
                <View style={styles.cardMetaItem}>
                  <Icon name="calendar-range" size={16} color="#8E8E93" />
                  <Text style={styles.cardMonthText}>Jan - Jun 2025</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons Section */}
      <Text
        style={[styles.sectionTitle, {paddingHorizontal: '5%', marginTop: 5}]}>
        Quick Actions
      </Text>
      <View style={styles.actionsContainer}>
        {actionButtons.map(button => (
          <TouchableOpacity
            key={button.id}
            style={[styles.actionButton, {backgroundColor: button.color}]}
            onPress={() => {
              button.id === 'Users' && navigation.navigate('Users');
              button.id === 'Donations' && navigation.navigate('Donations');
              button.id === 'Configurations' &&
                navigation.navigate('Configurations');
            }}>
            <Icon name={button.icon} size={32} color="#FFF" />
            <Text style={styles.actionButtonText}>{button.id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
    paddingBottom: 20,
  },
  topBarContainer: {
    height: '10%',
    width: '100%',
    backgroundColor: '#6E11B0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  cardIcon: {
    justifyContent: 'center',
    paddingRight: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  actionButton: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  sectionContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6E11B0',
    marginBottom: 15,
  },
  cardsContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#6E11B0',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
  },
  cardText: {
    color: '#6E11B0',
    fontSize: 18,
    fontWeight: '700',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBalText: {
    fontWeight: '900',
    color: '#000',
    fontSize: 24,
  },
  cardMeta: {
    alignItems: 'flex-end',
  },
  cardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardMonthText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});
