import React, { Component } from 'react';
import './App.css';
import LoginScreen from './Loginscreen';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {blue500} from 'material-ui/styles/colors';
import Dropzone from 'react-dropzone';
var request = require('superagent');

// import Drawer from 'material-ui/Drawer';
// import MenuItem from 'material-ui/MenuItem';

var apiBaseUrl = "http://localhost:4000/api/";


class UploadScreen extends Component {
    constructor(props){
      super(props);
      this.state={
        role:'student',
        filesPreview:[],
        filesToBeSent:[],
        draweropen:false,
        printcount:10,
        printingmessage:'',
        printButtonDisabled:false
      }
    }
    componentWillMount(){
     
      var printcount;
     
      if(this.props.role){
        if(this.props.role == 'student'){
          printcount = 5;
        }
        else if(this.props.role == 'teacher'){
          printcount =10;
        }
      }
      this.setState({printcount,role:this.props.role});
    }
    
    handleCloseClick(event,index){
     
      var filesToBeSent=this.state.filesToBeSent;
      filesToBeSent.splice(index,1);
      
      var filesPreview=[];
      for(var i in filesToBeSent){
        filesPreview.push(<div>
          {filesToBeSent[i][0].name}
          <MuiThemeProvider>
          <a href="#"><FontIcon
            className="material-icons customstyle"
            color={blue500}
            onClick={(event) => this.handleCloseClick(event,i)}
          >clear</FontIcon></a>
          </MuiThemeProvider>
          </div>
        )
      }
      this.setState({filesToBeSent,filesPreview});
    }
    
    onDrop(acceptedFiles, rejectedFiles) {
      
        var filesToBeSent=this.state.filesToBeSent;
        if(filesToBeSent.length < this.state.printcount){
          filesToBeSent.push(acceptedFiles);
          var filesPreview=[];
          for(var i in filesToBeSent){
            filesPreview.push(<div>
              {filesToBeSent[i][0].name}
              <MuiThemeProvider>
              <a href="#"><FontIcon
                className="material-icons customstyle"
                color={blue500}
                styles={{ top:10,}}
                onClick={(event) => this.handleCloseClick(event,i)}
              >clear</FontIcon></a>
              </MuiThemeProvider>
              </div>
            )
          }
          this.setState({filesToBeSent,filesPreview});
        }
        else{
          alert("You have reached the limit of printing files at a time")
        }
  
        
  }
  
  handleClick(event){
   
    this.setState({printingmessage:"Please wait until your files are being printed",printButtonDisabled:true})
    var self = this;
    if(this.state.filesToBeSent.length>0){
      var filesArray = this.state.filesToBeSent;
      var req = request.post(apiBaseUrl+'fileprint');
      for(var i in filesArray){
          
          req.attach(filesArray[i][0].name,filesArray[i][0])
      }
      req.end(function(err,res){
        if(err){
          console.log("error ocurred");
        }
        console.log("res",res);
        self.setState({printingmessage:'',printButtonDisabled:false,filesToBeSent:[],filesPreview:[]});
        alert("File printing completed")
       
      });
    }
    else{
      alert("Please upload some files first");
    }
  }
 
  toggleDrawer(event){
   
    this.setState({draweropen: !this.state.draweropen})
  }
  
  handleDivClick(event){
    
    if(this.state.draweropen){
      this.setState({draweropen:false})
    }
  }
  
  handleLogout(event){
    
    var loginPage =[];
    loginPage.push(<LoginScreen appContext={this.props.appContext}/>);
    this.props.appContext.setState({loginPage:loginPage,uploadScreen:[]})
  }
    render() {
      return (
        <div className="App">
            <div onClick={(event) => this.handleDivClick(event)}>
            <center>
            <div>
              You can print upto {this.state.printcount} files at a time since you are {this.state.role}
            </div>
  
            <Dropzone onDrop={(files) => this.onDrop(files)}>
                  <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
            <div>
            Files to be printed are:
            {this.state.filesPreview}
            </div>
            </center>
            <div>
            {this.state.printingmessage}
            </div>
        <MuiThemeProvider>
             <RaisedButton disabled={this.state.printButtonDisabled} label="Print Files" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
        </MuiThemeProvider>
            </div>
            </div>
      );
    }
  }
  
  const style = {
    margin: 15,
  };
  
  export default UploadScreen;
  