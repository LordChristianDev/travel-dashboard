import { Link, useLocation } from "react-router";
import { ChipDirective, ChipListComponent, ChipsDirective } from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWord } from "~/lib/utils";

import marker from "/assets/icons/location-mark.svg";


const TripCard = ({
	id,
	name,
	imageUrl,
	location,
	tags,
	price
}: TripCardProps
) => {
	const path = useLocation();

	const renderTags = tags.map((tag, index) => {
		return (
			<ChipDirective
				key={index + getFirstWord(tag)}
				text={getFirstWord(tag)}
				cssClass={cn(
					index === 1
						? '!bg-pink-50 !text-pink-500'
						: '!bg-success-50 !text-success-700'
				)}
			/>
		);
	});

	return (
		<Link
			to={path.pathname === '/' || path.pathname.startsWith('/travel')
				? `/travel/${id}`
				: `/trips/${id}`
			}
			className="trip-card"
		>
			<img
				src={imageUrl}
				alt="name"
			/>

			<article>
				<h2>{name}</h2>

				<figure>
					<img
						src={marker}
						alt="location"
						className="size-4"
					/>

					<figcaption>{location}</figcaption>
				</figure>
			</article>

			<div className="mt-5 pl-[18px] pr-3.5 pb-5">
				<ChipListComponent id="travel-chip">
					<ChipsDirective>
						{renderTags}
					</ChipsDirective>
				</ChipListComponent>
			</div>

			<article className="tripCard-pill">{price}</article>
		</Link>
	)
}

export default TripCard;
