JWT token 3 parts me hota hai: header, payload, aur signature.
jwt.verify(token, secret) function token ko decode karta hai, fir header + payload se nayi signature generate karta hai using the given secret key.
Agar yeh regenerated signature original signature se match ho jaata hai, to token valid mana jaata hai aur payload return hota hai.
Agar match nahi hua, to error throw hota hai — jaise invalid signature ya token expired.
