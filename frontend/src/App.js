import {Component} from "react"
class Registration extends Component{
  state={
    userName:"",
    userPassword:"",
    userEmail:"",
    isError:false
  }
  onChangeUserName=e=>{
    this.setState({userName:e.target.value})
  }
  onChangeUserPassword=e=>{
    this.setState({userPassword:e.target.value})
  }
  onChangeEmail=e=>{
    this.setState({userEmail:e.target.value})
  }
  onClickSubmit= async (event)=>{
    event.preventDefault()
    const {userName,userPassword,userEmail}=this.state

    const a={userName:userName,email:userEmail,password:userPassword}
    const b="http://localhost:3001/register"
    const c={
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
      },
      body:JSON.stringify(a)
      
      
    
    }
    const e=await fetch (b,c)
    if (e.ok){
      const y=await e.json()
      
      console.log("registarion successful")

    }
  }

  render(){
    const {userName,userPassword,userEmail}=this.state
    return (
      <div style={{backgroundColor:"blue",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <div style={{backgroundColor:"white",borderRadius:"20px",padding:"10px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
          <form style={{display:"flex",flexDirection:"column",alignItems:"center"}} onSubmit={this.onClickSubmit}>
            <label for="username" style={{alignSelf:"flex-start"}}>user name</label>
            <input id="username" type="text" onChange={this.onChangeUserName} value={userName}/>
            <label for="useremail" style={{alignSelf:"flex-start"}}>user email</label>
            <input id="useremail" type="text" onChange={this.onChangeEmail} value={userEmail}/>
            <label for="userpassword" style={{alignSelf:"flex-start"}}>user password</label>
            <input id="userpassword" type="password" onChange={this.onChangeUserPassword} value={userPassword}/>
            <button type="submit" style={{margin:"10px"}}>Register</button>


          </form>

        </div>

      </div>
    )
  }
}
export default Registration