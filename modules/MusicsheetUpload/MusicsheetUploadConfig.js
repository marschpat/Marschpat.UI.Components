import React from 'react';
import { authRoles } from 'app/auth';

const MusicsheetUploadConfig = {
	auth: authRoles.userJumpseat,
	routes: [
		{
			path: '/apps/musicsheet-upload',
			component: React.lazy(() => import('./MusicsheetUploaderIndex')),
		},
	]
};

export default MusicsheetUploadConfig;
