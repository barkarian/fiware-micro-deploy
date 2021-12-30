<script>
	import {user,access_token,refresh_token,roleUser,roleAdmin,roleEventOrganizer} from '../stores/store';
</script>
<p>user:
    {JSON.stringify($user)}</p>
<p>access_token:
    {JSON.stringify($access_token)}</p>
<p>refresh_token:
    {JSON.stringify($refresh_token)}</p>
<p>roles:</p>
<p>roleUser            ->{JSON.stringify($roleUser)}</p>
<p>roleAdmin           ->{JSON.stringify($roleAdmin)}</p>
<p>roleEventOrganizer  ->{JSON.stringify($roleEventOrganizer)}</p>