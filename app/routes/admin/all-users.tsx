import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';

import { Header } from "components";
import { getAllUsers } from '~/appwrite/auth';
import type { Route } from './+types/all-users';
import { cn, formatDate } from '~/lib/utils';

export const loader = async () => {
	const { users, total } = await getAllUsers(10, 0);
	return { users, total };
}

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
	const { users } = loaderData;

	const renderNameTemplate = (props: UserData) => {
		const { name, imageUrl } = props;

		return (
			<div className='px-4 flex items-center gap-1.5 '>
				<img
					src={imageUrl}
					alt="user"
					className='rounded-full size-8 aspect-square'
					referrerPolicy='no-referrer'
				/>

				<span>{name}</span>
			</div>
		);
	}

	const renderStatusTemplate = (props: UserData) => {
		const { status } = props;

		return (
			<article className={cn(
				'status-column',
				status === 'user'
					? 'bg-success-50'
					: 'bg-light-300'
			)}>
				<div className={cn(
					'size-1.5 rounded-full',
					status === 'user'
						? 'bg-success-500'
						: 'bg-gray-500'
				)} />

				<h3 className={cn(
					'font-inter text-xs font-medium',
					status === 'user'
						? 'text-success-700'
						: 'text-gray-500'
				)}>
					{status}
				</h3>
			</article>
		);
	}

	const renderEmailTemplate = ({ joinedAt }: { joinedAt: string }) => {
		return (
			formatDate(joinedAt)
		);
	}


	return (
		<main className="all-users wrapper">
			<Header
				title="Manager Users"
				description='Filter, sort and access detailed user profiles'
			/>

			<GridComponent dataSource={users}>
				<ColumnsDirective>
					<ColumnDirective
						field="name"
						headerText="Name"
						width="200"
						textAlign="Left"
						template={renderNameTemplate}
					/>

					<ColumnDirective
						field="email"
						headerText="Email Address"
						width="200"
						textAlign="Left"
					/>

					<ColumnDirective
						field="joinedAt"
						headerText="Date Joined"
						width="120"
						textAlign="Left"
						template={renderEmailTemplate}
					/>

					<ColumnDirective
						field="status"
						headerText="Type"
						width="100"
						textAlign="Left"
						template={renderStatusTemplate}
					/>

				</ColumnsDirective>
			</GridComponent>
		</main>
	);
}

export default AllUsers;