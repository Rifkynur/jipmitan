const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const main = async () =>{
const targetDate = new Date('2025-04-26')
// targetDate.setHours(0, 0, 0, 0);

const rt09 = await prisma.rt.findUnique({
    where:{name:"09"},
    include:{Member:true}
})

for(member of rt09.Member){
    await prisma.income.create({
        data:{
            date:targetDate,
            amount:2000,
            desc:"jimpitan rutin",
            memberId:member.id,
            userId:"852c9bc0-9190-41f0-92f5-898fa3da2136"
        }
    })
    console.log(`Income ditambahkan untuk member: ${member.name}`);
}

}

main()