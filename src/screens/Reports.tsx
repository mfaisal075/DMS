import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';

const Reports = () => {
  const [open, setOpen] = useState(false);
  const [distOpen, setDistOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [ucOpen, setUCOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [distValue, setDistValue] = useState(null);
  const [zoneValue, setZoneValue] = useState(null);
  const [ucValue, setUCValue] = useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  const [items, setItems] = useState([
    {label: 'Donation type 1', value: 1},
    {label: 'Donation type 22', value: 2},
    {label: 'Donation type 3', value: 3},
    {label: 'Education fund', value: 4},
    {label: 'Donation type 5', value: 5},
    {label: 'Health Fund', value: 6},
    {label: 'New type', value: 7},
  ]);

  const [districtItems, setDistrictItems] = useState([
    {label: 'Wazirabad District', value: 1},
    {label: 'Lahore District', value: 2},
    {label: 'Gujranwala District', value: 3},
    {label: 'Sheikhupura District', value: 4},
    {label: 'Rawalpindi District', value: 5},
    {label: 'Mardan District', value: 6},
    {label: 'Karachi District', value: 7},
  ]);

  const [zoneItems, setZoneItems] = useState([
    {label: 'Wazirabad Zone', value: 1},
    {label: 'Lahore Zone', value: 2},
    {label: 'Gujranwala Zone', value: 3},
    {label: 'Sheikhupura Zone', value: 4},
    {label: 'Rawalpindi Zone', value: 5},
    {label: 'Mardan Zone', value: 6},
    {label: 'Karachi Zone', value: 7},
  ]);

  const [ucItems, setUCItems] = useState([
    {label: 'Union council 20', value: 1},
    {label: 'Union council 3', value: 2},
    {label: 'UC 1 Ali Pur Chattha', value: 3},
    {label: 'UC Kalaske', value: 4},
    {label: 'Union council 70', value: 5},
    {label: 'Union council 18', value: 6},
    {label: 'New UC', value: 7},
  ]);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBarContainer}>
        <Image
          source={require('../assets/logo-black.png')}
          style={{width: 100, height: 100}}
          tintColor={'#fff'}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Reports</Text>
        <TouchableOpacity>
          <Icon name="account-circle" size={45} color="#fff" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          padding: 20,
        }}>
        <View style={styles.receiveDonContainer}>
          {/* Filters */}
          <Text style={styles.sectionTitle}>Donation Reports</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.textInput}
              placeholder="Donor Name"
              placeholderTextColor={'#666'}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.textInput,
                {
                  width: '46%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(245, 245, 245, 0.2)',
                  marginTop: 8,
                },
              ]}
              onPress={() => setFromDateOpen(true)}
              activeOpacity={0.8}>
              <Text style={{color: '#222', fontSize: 16}}>
                {fromDate ? fromDate.toLocaleDateString() : 'From Date'}
              </Text>
              <Icon name="calendar" size={22} color="#6E11B0" />
              <DatePicker
                modal
                open={fromDateOpen}
                mode="date"
                date={fromDate}
                onConfirm={date => {
                  setFromDateOpen(false);
                  setFromDate(date);
                }}
                onCancel={() => {
                  setFromDateOpen(false);
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.textInput,
                {
                  width: '46%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(245, 245, 245, 0.2)',
                  marginTop: 8,
                },
              ]}
              onPress={() => setFromDateOpen(true)}
              activeOpacity={0.8}>
              <Text style={{color: '#222', fontSize: 16}}>
                {toDate ? toDate.toLocaleDateString() : 'To Date'}
              </Text>
              <Icon name="calendar" size={22} color="#6E11B0" />
              <DatePicker
                modal
                open={toDateOpen}
                mode="date"
                date={toDate}
                onConfirm={date => {
                  setToDateOpen(false);
                  setToDate(date);
                }}
                onCancel={() => {
                  setToDateOpen(false);
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select Type"
                placeholderStyle={{
                  color: '#888',
                  fontSize: 16,
                }}
                ArrowUpIconComponent={() => (
                  <Icon name="chevron-up" size={25} color="#6E11B0" />
                )}
                ArrowDownIconComponent={() => (
                  <Icon name="chevron-down" size={25} color="#6E11B0" />
                )}
                style={styles.dropDown}
                textStyle={{
                  fontSize: 14,
                  color: '#222',
                }}
                labelProps={{
                  numberOfLines: 1,
                  ellipsizeMode: 'tail',
                }}
                dropDownContainerStyle={{
                  borderRadius: 12,
                  maxHeight: 200,
                }}
                listItemContainerStyle={{
                  height: 45,
                }}
                listItemLabelStyle={{
                  fontSize: 16,
                  color: '#222',
                  overflow: 'hidden',
                }}
              />
            </View>
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                open={distOpen}
                value={distValue}
                items={districtItems}
                setOpen={setDistOpen}
                setValue={setDistValue}
                setItems={setDistrictItems}
                placeholder="Select District"
                placeholderStyle={{
                  color: '#888',
                  fontSize: 16,
                }}
                ArrowUpIconComponent={() => (
                  <Icon name="chevron-up" size={25} color="#6E11B0" />
                )}
                ArrowDownIconComponent={() => (
                  <Icon name="chevron-down" size={25} color="#6E11B0" />
                )}
                style={styles.dropDown}
                textStyle={{
                  fontSize: 14,
                  color: '#222',
                }}
                labelProps={{
                  numberOfLines: 1,
                  ellipsizeMode: 'tail',
                }}
                dropDownContainerStyle={{
                  borderRadius: 12,
                  maxHeight: 200,
                }}
                listItemContainerStyle={{
                  height: 45,
                }}
                listItemLabelStyle={{
                  fontSize: 16,
                  color: '#222',
                  overflow: 'hidden',
                }}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                open={zoneOpen}
                value={zoneValue}
                items={zoneItems}
                setOpen={setZoneOpen}
                setValue={setZoneValue}
                setItems={setZoneItems}
                placeholder="Select Zone"
                placeholderStyle={{
                  color: '#888',
                  fontSize: 16,
                }}
                ArrowUpIconComponent={() => (
                  <Icon name="chevron-up" size={25} color="#6E11B0" />
                )}
                ArrowDownIconComponent={() => (
                  <Icon name="chevron-down" size={25} color="#6E11B0" />
                )}
                style={styles.dropDown}
                textStyle={{
                  fontSize: 14,
                  color: '#222',
                }}
                labelProps={{
                  numberOfLines: 1,
                  ellipsizeMode: 'tail',
                }}
                dropDownContainerStyle={{
                  borderRadius: 12,
                  maxHeight: 200,
                }}
                listItemContainerStyle={{
                  height: 45,
                }}
                listItemLabelStyle={{
                  fontSize: 16,
                  color: '#222',
                  overflow: 'hidden',
                }}
              />
            </View>
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                open={ucOpen}
                value={ucValue}
                items={ucItems}
                setOpen={setUCOpen}
                setValue={setUCValue}
                setItems={setUCItems}
                placeholder="Select UC"
                placeholderStyle={{
                  color: '#888',
                  fontSize: 16,
                }}
                ArrowUpIconComponent={() => (
                  <Icon name="chevron-up" size={25} color="#6E11B0" />
                )}
                ArrowDownIconComponent={() => (
                  <Icon name="chevron-down" size={25} color="#6E11B0" />
                )}
                style={styles.dropDown}
                textStyle={{
                  fontSize: 14,
                  color: '#222',
                }}
                labelProps={{
                  numberOfLines: 1,
                  ellipsizeMode: 'tail',
                }}
                dropDownContainerStyle={{
                  borderRadius: 12,
                  maxHeight: 200,
                }}
                listItemContainerStyle={{
                  height: 45,
                }}
                listItemLabelStyle={{
                  fontSize: 16,
                  color: '#222',
                  overflow: 'hidden',
                }}
              />
            </View>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>Generate Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>Clear Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <View style={styles.separator} />
        </View>
      </View>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  row: {
    marginTop: 15,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
  },
  dropDownContainer: {
    width: '46%',
  },
  dropDown: {
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    borderColor: '#888',
    borderWidth: 0.6,
    borderRadius: 8,
  },
  textInput: {
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    borderRadius: 8,
    borderColor: '#888',
    borderWidth: 0.6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
    width: '100%',
    height: 45,
  },
  separator: {
    marginTop: 15,
    marginBottom: 10,
    height: 1,
    backgroundColor: '#666',
    width: '90%',
    alignSelf: 'center',
  },
  receiveDonContainer: {
    paddingVertical: '5%',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#6E11B0',
    marginLeft: 15,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#6E11B0',
    borderRadius: 10,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
  },
});
