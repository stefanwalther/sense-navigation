/*global define*/
define( [
	'jquery',
	'underscore',
	'ng!$http',
	'ng!$q',
	'qlik'
], function ( $,
			  _,
			  $http,
			  $q,
			  qlik ) {
	'use strict';

	/**
	 * Add as style link to the document's header
	 * @param {String} linkUrl Url to the CSS file
	 * @param {String}  id If an id is passed, the function will check if this style link has already been added or not.
	 * If yes, it will not be added again.
	 */
	function addStyleLinkToHeader ( linkUrl, id ) {
		if ( id && !_.isEmpty( id ) ) {
			if ( !$( '#' + id ).length ) {
				var $styleLink = $( document.createElement( 'link' ) );
				$styleLink.attr( 'rel', 'stylesheet' );
				$styleLink.attr( 'type', 'text/css' );
				$styleLink.attr( 'href', linkUrl );
				if ( id && !_.isEmpty( id ) ) {
					$styleLink.attr( 'id', id );
				}
				$( 'head' ).append( $styleLink );
			}
		}
	}

	/**
	 * Add a style to the document's header.
	 * @param cssContent {String} CSS content to be added to the header
	 * @param id {String} If id is passed, addStyleToHeader will check if there has already been added a style with the given id, if yes, the css content will not be added to the header again
	 */
	function addStyleToHeader ( cssContent, id ) {
		if ( id && typeof id === 'string' ) {
			if ( !$( '#' + id ).length ) {
				$( "<style>" )
					.attr( 'id', id )
					.html( cssContent ).appendTo( "head" );
			}
		} else {
			$( "<style>" ).html( cssContent ).appendTo( "head" );
		}
	}

  function getBasePath () {

  var appOptions = qlik.currApp().global.session.options;
  var url = (appOptions.secure ? "https://" : "http://") 
          + appOptions.host 
          + (appOptions.port.length > 0 ? ":" + appOptions.port : "") 
          + appOptions.prefix.substr( 0, appOptions.prefix.length - 1);

  return url;
  }

	function getExtensionInfo ( extensionUniqueName ) {
		var defer = $q.defer();

		var url = getBasePath() + '/extensions/' + extensionUniqueName + '/' + extensionUniqueName + '.qext';
		$http.get( url )
			.then( function ( response ) {
				defer.resolve( response.data );
			} ).catch( function ( err ) {
			defer.reject( err );
		} );

		return defer.promise;
	}

	function getExtensionPath ( extensionUniqueName ) {
		return window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/sense" ) + 1 ) + 'extensions/' + extensionUniqueName;
	}

	function getProductVersion () {
		var defer = $q.defer();
		var global = qlik.getGlobal( {} );

		global.getProductVersion( function ( reply ) {
			var v = reply.qReturn;
			var lastDot = xIndexOf( v, '.', 2 );
			var rest = v.substr( lastDot + 1 );
			var chars = rest.split();
			var numDigitsAfterRest = 0;
			for ( var i = 0; i < chars.length; i++ ) {
				if ( !_.isNumber( chars[i] ) ) {
					numDigitsAfterRest = i + 1;
					break;
				}
			}
			defer.resolve( v.substr( 0, lastDot + 1 + numDigitsAfterRest ) );
		} );

		return defer.promise;
	}

	if(typeof String.prototype.startsWith != 'function'){
		String.prototype.startsWith = function(str){
			if(str == null) return false;
			var i = str.length;
			if(this.length < i) return false;
			for(--i; (i >= 0) && (this[i] === str[i]); --i) continue;
			return i < 0;
		}
	}

	return {
		addStyleToHeader: addStyleToHeader,
		addStyleLinkToHeader: addStyleLinkToHeader,
		getExtensionInfo: getExtensionInfo,
		getExtensionPath: getExtensionPath,
		getProductVersion: getProductVersion,
		getBasePath: getBasePath
	}
} );
