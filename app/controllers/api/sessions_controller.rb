module Api
  class SessionsController < ApplicationController
    def create
      @user = User.find_by(username: params[:user][:username])

      if @user and BCrypt::Password.new(@user.password) == params[:user][:password]
        session = @user.sessions.create
        cookies.permenant.signed[:mounter_session_token] = {
          value: session.token,
          httponly: true,
        }

        user_characters = @user.characters

        render json: { success: true, characters: user_characters }, status: :created
      else
        render json: { success: false }, status: :bad_request
      end
    end

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