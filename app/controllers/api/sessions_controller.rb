module Api
  class SessionsController < ApplicationController
    def create
      @user = User.find_by(username: params[:user][:username])

      if @user and BCrypt::Password.new(@user.password) == params[:user][:password]
        session = @user.sessions.create
        cookies.permanent.signed[:mounter_session_token] = {
          value: session.token,
          httponly: true,
        }

        # Return the user's characters
        user_characters = @user.characters

        render json: { success: true, characters: user_characters, username: @user.username }, status: :created
      else
        render json: { success: false }, status: :bad_request
      end
    end

    def authenticate
      token = cookies.signed[:mounter_session_token]
      session = Session.find_by(token: token)

      if session
        # If the session is valid, return the user's characters
        user_characters = session.user.characters
        username = session.user.username

        render json: { success: true, characters: user_characters, username: username }, status: :ok
      else
        render json: { success: false }, status: :unauthorized
      end
    end

    # Logs the user out by deleting the session
    def destroy
      token = cookies.signed[:mounter_session_token]
      session = Session.find_by(token: token)

      if session and session.destroy
        render json: { success: true }, status: :ok
      else
        render json: { success: false }, status: :bad_request
      end
    end
  end
end