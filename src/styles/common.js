import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:50
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
  },
  button: {
    marginTop: 50,
    borderCurve:"circular"
  },
  header:{
    fontSize: 32,
    fontWeight:"800",
    alignSelf:"center",
    paddingBottom:30
  }
});

export default commonStyles;
