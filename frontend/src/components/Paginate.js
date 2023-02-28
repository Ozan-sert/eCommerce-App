import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '', itemsPerPage }) => {
	return (
		pages > 1 && (
			<Pagination>
				{[...Array(pages).keys()].map((pageKey) => (
					<LinkContainer
						key={pageKey + 1}
						to={
							!isAdmin && keyword
								? `/search/${keyword}/page/${pageKey + 1}/${itemsPerPage}`
								: !isAdmin
								? `/page/${pageKey + 1}/${itemsPerPage}`
								: `/admin/productlist/${pageKey + 1}/${itemsPerPage}`
						}
					>
						<Pagination.Item active={pageKey + 1 === page}>{pageKey + 1}</Pagination.Item>
					</LinkContainer>
				))}
			</Pagination>
		)
	);
};

export default Paginate;
