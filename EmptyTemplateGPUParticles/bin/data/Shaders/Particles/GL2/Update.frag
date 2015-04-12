#version 120

#extension GL_ARB_draw_buffers : enable

#pragma include "Shaders/Common/ShaderHelpers.glslinc"
#pragma include "Shaders/Common/SimplexNoiseDerivatives4D.glslinc"

uniform sampler2D u_positionAndAgeTex;

uniform float u_time;
uniform float u_timeStep;


// -----------------------------------------------------------
void main (void)
{
	vec2 texCoord = gl_TexCoord[0].st;
	vec4 posAndAge = texture2D( u_positionAndAgeTex, texCoord );
	
	vec3 pos = posAndAge.xyz;
	float age = posAndAge.w;
	
	age += u_timeStep;
	
	if( age > u_particleMaxAge )
	{
		age = 0.0;
		
		float spawnRadius = 0.1;
		pos = randomPointOnSphere( vec3( rand( texCoord + pos.xy ), rand( texCoord.xy + pos.yz ), rand( texCoord.yx + pos.yz ))) * spawnRadius;
	}
	
	vec3 vel = vec3(0,0,0);
	vec3 newPos = pos + vel * u_timeStep;
	
	pos = newPos;
	
	gl_FragData[0] = vec4( pos, age );
	
	// If we had multiple color buffers in our fbo and they were bound for writing, this would be how we write to them from this shader
	//gl_FragData[1] = vec4( vel, 1.0 );
	//gl_FragData[2] = vec4( particleAge, particleDat.y, particleDat.z, 1.0 );
	
}

