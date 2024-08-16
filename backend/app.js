const express=require("express")
const app=express()
const {open}=require("sqlite")
const sqlite3=require("sqlite3")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const path=require("path")
const dbPath=path.join(__dirname,"userDetails.db")
const cors=require("cors")

app.use(cors())
app.use(cors({origin:"http://localhost:3001"}))
app.use(express.json())
let db
const initialization=async()=>{
    try{
    db= await open({filename:dbPath,
        driver:sqlite3.Database
    })
    app.listen(3000,()=>{
        console.log("success")
    })
}
catch(e){
    
    console.log(e)
    process.exit(1)
}

}
initialization()
const authentication=(request,response,next)=>{
    const {authorization}=request.headers
    let token
    const auth=authorization.split(" ")
    if (auth===undefined){
        response.send("invalid user")
    }
    else {
        if (auth[1]===undefined){
            response.send("invalid token")
        }

        else{
            token=auth[1]
            jwt.verify(token,"my_string",async (error,payLoad)=>{
                if (error){
                    response.send("token is not correct")
                }
                else{
                    request=payLoad
                    next()
                }
            })
        }
    }
}
app.get("/userDetails", async (request,response)=>{
    const a=`select *
    from userDetails;`
    const b=await db.all(a)
    response.send(b)

})
app.post("/register",async (request,response)=>{
    const {username,email,password,}=request.body
    const securePassword=await bcrypt.hash(password,10)
    const a=`insert into userDetails
    (username,email,password)

    values ("${username}","${email}","${securePassword}");`
    const b=await db.run(a)
    response.send("successfully created")
})
app.put("/replaceDetails/:id",async (request,response)=>{
    const {id}=request.params
    const k=request.body
    let s=""
    if (k.username!==undefined){
        s="username"

    }
    else if (k.email!==undefined){
        s="email"
    }
    else if (k.password!==undefined){
        s="password"
    }
    const a=`select *
    from userDetails
    where id="${id}";`
    const b=await db.get(a)
    const {username=b.username,email=b.email,password=b.password}=request.body
    const c=`UPDATE userDetails
    SET 
    username="${username}",email="${email}",password="${password}"
    where id="${id}";`
    const d=await db.run(c)
    response.send(`${s} updated`)
})
app.delete("/delete/:email", async (request,response)=>{
    const {email}=request.body
    const a=`delete from userDetails
    where id="${email}";`
    const b=await db.run(a)
    response.send("successfully deleted")
})

app.post("/login",async (request,response)=>{
    const {username,password}=request.body
    const a=`select *
    from userDetails
    where username="${username}";`
    const b=await db.get(a)
    if (b===undefined){
        response.send("invalid username")
    }
    else{
        const isPasswordValid=await bcrypt.compare(password,b.password)
        if (isPasswordValid){
            const payLoad={username:`${username}`}
            console.log(payLoad)
            const s=jwt.sign(payLoad,"my_string")
            response.send({jwtToken:s})
        }
        else{
            response.send("invalid password")
        }
    }
})
app.delete ("/delete",async(request,response)=>{
    const a=`delete from userDetails;
    `
    const b=await db.run(a)
    response.send("successfully deleted all rows")
})