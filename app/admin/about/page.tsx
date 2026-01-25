
import AboutAdminPage from './form'
import prisma from '@/lib/prisma'

export default async function Page() {
    const vision = await prisma.siteContent.findUnique({ where: { key: 'vision' } })
    const mission = await prisma.siteContent.findUnique({ where: { key: 'mission' } })

    return <AboutAdminPage
        vision={vision?.content || ''}
        mission={mission?.content || ''}
    />
}
