// --------------------------------------------------------------------------
// gMini,
// a minimal Glut/OpenGL app to extend                              
//
// Copyright(C) 2007-2009                
// Tamy Boubekeur
//                                                                            
// All rights reserved.                                                       
//                                                                            
// This program is free software; you can redistribute it and/or modify       
// it under the terms of the GNU General Public License as published by       
// the Free Software Foundation; either version 2 of the License, or          
// (at your option) any later version.                                        
//                                                                            
// This program is distributed in the hope that it will be useful,            
// but WITHOUT ANY WARRANTY; without even the implied warranty of             
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              
// GNU General Public License (http://www.gnu.org/licenses/gpl.txt)           
// for more details.                                                          
//                                                                          
// --------------------------------------------------------------------------

uniform float ambientRef;
uniform float diffuseRef;
uniform float specularRef;
uniform float shininess;
uniform float levelRef;
uniform float levelR;
uniform float levelV;
uniform float levelB;

varying vec4 p;
varying vec3 n;

void main (void) {
    vec3 P = vec3 (gl_ModelViewMatrix * p); //Position du point à éclairer
    vec3 N = normalize (gl_NormalMatrix * n); //Normal en ce point
    vec3 V = normalize (-P); //Vecteur de vue
    
    vec4 Isa = gl_LightModel.ambient;
    vec4 Ka = gl_FrontMaterial.ambient;
    vec4 Ia = Isa * Ka; //intensiter ambient

    vec4 I = ambientRef * Ia ;

    //toon bore noir
    /*if(dot(N,V)<0.3){
        I=vec4(0.0,0.0,0.0,1.0);
        return ;
    }*/

    

    for(int i=0;i<4;i++){
        vec4 Isd = gl_LightSource[i].diffuse;
        vec4 Kd = gl_FrontMaterial.diffuse;
        vec3 L = normalize((gl_ModelViewMatrix*gl_LightSource[i].position).xyz-P);
        float cos_theta = max(0.0,dot(N, L));//gl_modelveiwmatrix c'est pour que la lumière reste au même endroit qand on bouge la cam //max(0.0,dot(N, normalize(gl_LightSource[0].position.xyz-P))); //dot(N,L) mais c'est quoi L

        /*for(float k=levelRef-1.0;k>=0.0;k--){ //toon
            if(cos_theta>=k/levelRef){
                cos_theta=k/levelRef;
                break;
            }
        }*/

        vec4 Id = Isd * Kd * cos_theta;

        I += diffuseRef * Id;

        vec4 Iss = gl_LightSource[i].specular;
        vec4 Ks = gl_FrontMaterial.specular;
        vec3 R = reflect(-L,N); //J'AI PAS COMPRIS PK CA CA NOUS DONNE R CAR CELA RESEMBLE PAS A LA FORMULE DU COURS
        vec4 Is = Iss*Ks*(pow(dot(R,V),shininess));

        I += specularRef * Is;
    }
    

    ////////////////////////////////////////////////
    //Eclairage de Phong à calculer en utilisant
    ///////////////////////////////////////////////
    // gl_LightSource[i].position.xyz Position de la lumière i
    // gl_LightSource[i].diffuse Couleur diffuse de la lumière i
    // gl_LightSource[i].specular Couleur speculaire de la lumière i
    // gl_FrontMaterial.diffuse Matériaux diffus de l'objet
    // gl_FrontMaterial.specular Matériaux speculaire de l'objet

/*
    if(I.r<0.25){
        I.r=0.0;
    }else if(I.r<0.75&&I.r>0.24){
        I.r=0.33;
    }else{
        I.r=0.66;
    }


    if(I.g<0.25){
        I.g=0.0;
    }else if(I.g<0.75&&I.g>0.24){
        I.g=0.33;
    }else{
        I.g=0.66;
    }

    if(I.b<0.25){
        I.b=0.0;
    }else if(I.b<0.75&&I.b>0.24){
        I.b=0.33;
    }else{
        I.b=0.66;
    }*/

    /*
    if(levelR> 0.0){
        for(float k=levelR-1.0;k>=0.0;k--){
            if(I.r>=k/levelR){
                I.r=k/levelR;
                break;
            }
        }
    }
    
    if(levelV> 0){
        for(float k=levelV-1.0;k>=0.0;k--){
            if(I.g>=k/levelV){
                I.g=k/levelV;
                break;
            }
        }
    }

    if(levelB> 0){
        for(float k=levelB-1.0;k>=0.0;k--){
            if(I.b>=k/levelB){
                I.b=k/levelB;
                break;
            }
        }
    }
    */


    gl_FragColor = vec4 (I.xyz, 1);
}

