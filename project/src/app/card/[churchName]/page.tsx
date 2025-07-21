import CardOfChurchNameContainer from "@/components/pages/card/[churchName]/CardOfChurchNameContainer";
import NotFoundChurch from "@/components/pages/card/[churchName]/NotFoundChurch";
import { getPublicCampChurchCards } from "@/service/table/camps/camps";
import { ChurchCardType } from "@/types/camp";

type PropsType = Promise<{ churchName: string }>;

export default async function CardDetail({ params }: { params: PropsType }) {
  const { churchName } = await params;

  const decodedChurchName = decodeURIComponent(churchName);
  const publicCampsData = await getPublicCampChurchCards();
  const churchCardInfo = publicCampsData?.find(
    (churchCard: ChurchCardType) => churchCard.churchName === decodedChurchName
  );

  if (!churchCardInfo) {
    return <NotFoundChurch/>;
  }

  return <CardOfChurchNameContainer churchCardInfo={churchCardInfo} />;
}
